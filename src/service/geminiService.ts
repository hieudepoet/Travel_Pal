
import { GoogleGenAI, Type, Schema, Chat, FunctionDeclaration } from "@google/genai";
import { UserPreferences, TripPlan, UserPreferencesPartial } from "../types/types";

// --- Configuration ---
// Support multiple environment variable standards to ensure it works in NextJS, Vite, or CRA
const apiKey = process.env.NEXT_PUBLIC_AGENT_API_KEY;

if (!apiKey) {
  console.error("❌ API KEY MISSING: Please check your .env file and variable names.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });
const MODEL_NAME = "gemini-2.5-flash"; // Flash model is faster and cheaper

// --- Global State for Chat Sessions ---
// In a production app, these should be managed via React Context or Redux to support multiple tabs
let tripChatSession: Chat | null = null;
let onboardingChatSession: Chat | null = null;

// --- Schemas ---

const eventSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    time: { type: Type.STRING },
    activity: { type: Type.STRING },
    locationName: { type: Type.STRING },
    address: { type: Type.STRING, description: "Address if known, otherwise leave generic" },
    description: { type: Type.STRING },
    costEstimate: { type: Type.NUMBER },
    currency: { type: Type.STRING },
    transportMethod: { type: Type.STRING },
    transportDuration: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["activity", "food", "lodging", "transport"] },
    status: { type: Type.STRING, enum: ["accepted", "rejected", "pending"] },
    bookingLink: { type: Type.STRING, description: "Link đặt vé Klook nếu có" },
    notes: { type: Type.STRING, description: "Lưu ý quan trọng: Trang phục, giờ mở cửa, độ đông đúc..." }
  },
  required: ["id", "time", "activity", "locationName", "costEstimate", "type"]
};

const daySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    day: { type: Type.INTEGER },
    date: { type: Type.STRING },
    theme: { type: Type.STRING },
    events: { type: Type.ARRAY, items: eventSchema }
  },
  required: ["day", "events"]
};

const tripPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    tips: { type: Type.STRING },
    stats: {
      type: Type.OBJECT,
      properties: {
        totalCost: { type: Type.NUMBER },
        currency: { type: Type.STRING },
        totalEvents: { type: Type.INTEGER },
        weatherSummary: { type: Type.STRING },
        durationDays: { type: Type.INTEGER }
      },
      required: ["totalCost", "weatherSummary"]
    },
    itinerary: { type: Type.ARRAY, items: daySchema }
  },
  required: ["summary", "itinerary", "stats"]
};

const userPrefsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    startDate: { type: Type.STRING },
    endDate: { type: Type.STRING },
    adults: { type: Type.INTEGER },
    children: { type: Type.INTEGER },
    budget: { type: Type.STRING },
    style: { type: Type.ARRAY, items: { type: Type.STRING } },
    prompt: { type: Type.STRING }
  }
};

// --- Tools ---

const updateItineraryTool: FunctionDeclaration = {
  name: "update_itinerary",
  description: "Update the trip plan JSON. Call this when the user asks for changes.",
  parameters: tripPlanSchema
};

const updateUserPrefsTool: FunctionDeclaration = {
  name: "update_user_preferences",
  description: "Extract user travel details during onboarding chat.",
  parameters: userPrefsSchema
};

// --- Helper Functions ---

/**
 * Robust JSON extraction that handles Markdown code blocks and raw text.
 */
const extractJsonFromText = (text: string): any => {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try extracting from markdown ```json ... ```
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try { return JSON.parse(jsonMatch[1]); } catch (e2) { }
    }

    // 3. Try finding the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      try { return JSON.parse(text.substring(firstBrace, lastBrace + 1)); } catch (e3) { }
    }

    console.error("RAW TEXT FAILED TO PARSE:", text);
    throw new Error("Could not parse JSON from AI response.");
  }
};

/**
 * Ensures the TripPlan object has all required arrays and fields to prevent UI crashes.
 */
const sanitizePlan = (plan: any): TripPlan => {
  if (!plan) throw new Error("Generated plan is null");

  // Handle tips: convert array to string if needed
  let safeTips = "Enjoy your trip!";
  if (plan.tips) {
    if (Array.isArray(plan.tips)) {
      safeTips = plan.tips.join(". ");
    } else if (typeof plan.tips === 'string') {
      safeTips = plan.tips;
    } else {
      safeTips = String(plan.tips);
    }
  }

  return {
    summary: plan.summary || "Your Trip Plan",
    tips: safeTips,
    stats: {
      totalCost: plan.stats?.totalCost || 0,
      currency: plan.stats?.currency || "USD",
      totalEvents: plan.stats?.totalEvents || 0,
      weatherSummary: plan.stats?.weatherSummary || "Check forecast",
      durationDays: plan.stats?.durationDays || 1
    },
    itinerary: Array.isArray(plan.itinerary) ? plan.itinerary.map((day: any) => ({
      day: day.day,
      date: day.date || "TBD",
      theme: day.theme || "Exploration",
      events: Array.isArray(day.events) ? day.events.map((evt: any) => ({
        ...evt,
        id: evt.id || Math.random().toString(36).substr(2, 9),
        time: evt.time || "09:00 AM", // Default time to prevent split error
        locationName: evt.locationName || "Unknown Location", // Default location
        status: evt.status || 'accepted',
        type: evt.type || 'activity',
        costEstimate: evt.costEstimate || 0,
        transportMethod: evt.transportMethod || "Tự túc",
        transportDuration: evt.transportDuration || "15 phút",
        bookingLink: evt.bookingLink || `https://www.klook.com/vi/search?query=${encodeURIComponent(evt.locationName || "")}`,
        notes: evt.notes || ""
      })) : []
    })) : []
  };
};

// --- Core Logic ---

/**
 * 1. MANUAL GENERATION (FORM SUBMIT)
 * Optimized for speed by restricting Google Search usage.
 */
export const generateTrip = async (prefs: UserPreferences): Promise<TripPlan> => {
  const budgetText = prefs.exactBudget && prefs.exactBudget > 0
    ? `Strict Budget: ${prefs.exactBudget} ${prefs.currency}`
    : `Budget Level: ${prefs.budget || "Moderate"}`;

  const partyText = `${prefs.partySize.adults} Adults, ${prefs.partySize.children} Children`;

  // PROMPT ENGINEERING FOR SPEED:
  // We explicitly tell Gemini NOT to search for every single restaurant/cafe.
  // It should only search for critical dynamic info (Weather, Ticket Prices).
  const prompt = `
    Act as an expert travel agent. Create a JSON itinerary for:
    Destination: ${prefs.destination}
    Dates: ${prefs.startDate} to ${prefs.endDate}
    Party: ${partyText}
    Style: ${prefs.style.join(", ")}
    ${budgetText}
    Notes: ${prefs.prompt}

    HƯỚNG DẪN TỐC ĐỘ VÀ DỮ LIỆU:
    1. Sử dụng Google Search để lấy thông tin chính xác về: Thời tiết, Giá vé, và ĐỊA CHỈ CỤ THỂ.
    2. ĐỊA CHỈ: Phải chi tiết (Số nhà, Đường, Phường/Xã, Quận/Huyện). Tránh ghi chung chung.
    3. Với nhà hàng/quán cafe: Ưu tiên quán nổi tiếng có địa chỉ rõ ràng trên Google Maps.
    4. BOOKING LINK: Tạo link search Klook cho các địa điểm tham quan/vé: "https://www.klook.com/vi/search?query={Tên địa điểm}".
    5. NOTES: Thêm lưu ý quan trọng (Trang phục, giờ mở cửa, nên đi lúc nào vắng...).
    6. Ngôn ngữ output: TIẾNG VIỆT.
    7. Cấu trúc ngày: Phải có đủ Sáng, Trưa, Chiều, Tối. Đừng để trống.

    JSON Structure Reference:
    {
      "summary": "Tóm tắt hấp dẫn về chuyến đi...",
      "tips": "3 lời khuyên quan trọng...",
      "stats": { "totalCost": 0, "currency": "VND", "totalEvents": 0, "weatherSummary": "...", "durationDays": 0 },
      "itinerary": [ 
          { 
            "day": 1, "date": "YYYY-MM-DD", "theme": "Chủ đề ngày", 
            "events": [ 
                {
                    "id": "uuid", "time": "HH:mm", "activity": "Tên hoạt động",
                    "locationName": "Tên địa điểm", "address": "Địa chỉ", 
                    "description": "Mô tả ngắn", "costEstimate": 0, "type": "activity/food/lodging",
                    "bookingLink": "https://www.klook.com/...", "notes": "Lưu ý..."
                }
            ] 
          } 
      ]
    }
    `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // Enable search, but relying on prompt to limit its usage
        tools: [{ googleSearch: {} }],
      }
    });

    if (!response.text) throw new Error("Empty response from AI");

    const rawPlan = extractJsonFromText(response.text);
    const plan = sanitizePlan(rawPlan);

    // Initialize the Chat Session immediately after generation
    // FIXED: Removed googleSearch from tools here to prevent "Tool use with function calling is unsupported" error
    tripChatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: `You are a helpful travel assistant managing a trip to ${prefs.destination}.
                When the user asks to change the plan (e.g., "Change dinner to sushi"), you MUST:
                1. Call the 'update_itinerary' tool with the COMPLETE updated JSON.
                2. Do not just describe the change in text.
                3. Keep text responses short.
                4. Use your internal knowledge for recommendations (Search is disabled for faster editing).`,
        tools: [{ functionDeclarations: [updateItineraryTool] }]
      },
      history: [
        { role: 'user', parts: [{ text: "I have just generated this trip plan. I am ready to review it." }] },
        { role: 'model', parts: [{ text: "Great! I have the plan loaded. What would you like to change?" }] }
      ]
    });

    return plan;

  } catch (error) {
    console.error("Generate Trip Error:", error);
    throw error;
  }
};

/**
 * 2. CHAT WITH PLAN (MODIFY TRIP)
 * Handles tool calling loop correctly.
 */
export const sendChatMessage = async (message: string, currentPlan: TripPlan): Promise<{ text: string, updatedPlan?: TripPlan }> => {
  if (!tripChatSession) {
    // Fallback: If session was lost (e.g. page refresh), try to recreate it roughly
    console.warn("Chat session lost, recreating...");
    // FIXED: Removed googleSearch here as well
    tripChatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        tools: [{ functionDeclarations: [updateItineraryTool] }]
      }
    });
  }

  try {
    // 1. Send User Message
    const result = await tripChatSession.sendMessage({ message });

    let responseText = result.text || "";
    let updatedPlan: TripPlan | undefined;

    // 2. Check for Tool Calls (The "Function Calling" Step)
    const toolCalls = result.functionCalls;

    if (toolCalls && toolCalls.length > 0) {
      for (const call of toolCalls) {
        if (call.name === 'update_itinerary') {
          console.log("🛠️ AI is updating the itinerary...");

          try {
            const rawUpdated = call.args as unknown as TripPlan;
            updatedPlan = sanitizePlan(rawUpdated); // Sanitize ensures no crash

            // 3. Send Tool Response BACK to Gemini (Critical for chat loop)
            // This tells the AI: "Tool executed successfully."
            const toolResponse = await tripChatSession.sendMessage({
              message: [{
                functionResponse: {
                  name: call.name,
                  response: { result: "Itinerary updated successfully." },
                  id: call.id
                }
              }]
            });

            // 4. Get final text response from AI after tool execution
            if (toolResponse.text) {
              responseText = toolResponse.text;
            } else {
              responseText = "I've updated your plan!";
            }

          } catch (err) {
            console.error("Error processing tool output:", err);
            responseText = "I tried to update the plan, but something went wrong with the data format.";
          }
        }
      }
    }

    return { text: responseText, updatedPlan };

  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "Sorry, I'm having trouble connecting to the AI right now." };
  }
};

/**
 * 3. ONBOARDING CHAT (OPTIONAL FLOW)
 * Collects user preferences conversationally.
 */
export const startOnboardingChat = () => {
  onboardingChatSession = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `You are a travel consultant. Interview the user to plan a trip.
            Ask ONE question at a time.
            Goal: Collect Destination, Dates, Party Size, Budget, and Style.
            Every time you get new info, call 'update_user_preferences'.
            NEVER generate a full itinerary plan text. Just collect data.`,
      tools: [{ functionDeclarations: [updateUserPrefsTool] }]
    }
  });
  return "Hi! I can help you plan a trip. Where do you want to go?";
};

export const sendOnboardingMessage = async (message: string): Promise<{ text: string, extractedPrefs?: UserPreferencesPartial }> => {
  if (!onboardingChatSession) startOnboardingChat();

  try {
    const result = await onboardingChatSession!.sendMessage({ message });
    let text = result.text || "";
    let extractedPrefs: UserPreferencesPartial | undefined;

    const toolCalls = result.functionCalls;
    if (toolCalls) {
      for (const call of toolCalls) {
        if (call.name === 'update_user_preferences') {
          const args = call.args as any;

          extractedPrefs = {
            destination: args.destination,
            startDate: args.startDate,
            endDate: args.endDate,
            budget: args.budget,
            prompt: args.prompt,
            partySize: (args.adults || args.children) ? {
              adults: args.adults,
              children: args.children
            } : undefined,
            style: args.style
          };

          const toolResponse = await onboardingChatSession!.sendMessage({
            message: [{
              functionResponse: {
                name: call.name,
                response: { result: "Preferences saved." },
                id: call.id
              }
            }]
          });
          if (toolResponse.text) text = toolResponse.text;
        }
      }
    }
    return { text, extractedPrefs };
  } catch (e) {
    console.error(e);
    return { text: "I didn't catch that. Could you repeat?" };
  }
};

/**
 * 4. REGENERATE REJECTED EVENTS
 */
export const updateTrip = async (currentPlan: TripPlan, rejectedIds: string[]): Promise<TripPlan> => {
  // Re-use the chat session to maintain context
  if (!tripChatSession) throw new Error("Session missing");

  const prompt = `The user rejected these event IDs: ${rejectedIds.join(", ")}. 
    Please replace them with different activities/restaurants. 
    Keep the rest of the plan the same. 
    Call update_itinerary with the new JSON.`;

  const { updatedPlan } = await sendChatMessage(prompt, currentPlan);
  if (!updatedPlan) throw new Error("Failed to regenerate events");

  return updatedPlan;
};

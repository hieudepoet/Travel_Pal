
import { GoogleGenAI, Type, Schema, Chat, FunctionDeclaration } from "@google/genai";
import { UserPreferences, TripPlan, UserPreferencesPartial } from "../types/types";

// --- Cấu hình ---
// Hỗ trợ nhiều biến môi trường để chạy trên NextJS, Vite, hoặc CRA
const apiKey = process.env.NEXT_PUBLIC_AGENT_API_KEY;

if (!apiKey) {
  console.error("❌ THIẾU API KEY: Vui lòng kiểm tra file .env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });
const MODEL_NAME = "gemini-2.5-flash";

// --- Trạng thái toàn cục ---
let tripChatSession: Chat | null = null;
let onboardingChatSession: Chat | null = null;

// --- Định nghĩa Schema (Cấu trúc dữ liệu) ---

const eventSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    time: { type: Type.STRING },
    activity: { type: Type.STRING },
    locationName: { type: Type.STRING },
    address: { type: Type.STRING, description: "Địa chỉ cụ thể nếu biết, nếu không để chung chung" },
    description: { type: Type.STRING },
    costEstimate: { type: Type.NUMBER },
    currency: { type: Type.STRING },
    transportMethod: { type: Type.STRING },
    transportDuration: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["activity", "food", "lodging", "transport"] },
    status: { type: Type.STRING, enum: ["accepted", "rejected", "pending"] }
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

// --- Công cụ (Tools) ---

const updateItineraryTool: FunctionDeclaration = {
  name: "update_itinerary",
  description: "Cập nhật JSON kế hoạch du lịch. Gọi hàm này khi người dùng yêu cầu thay đổi.",
  parameters: tripPlanSchema
};

const updateUserPrefsTool: FunctionDeclaration = {
  name: "update_user_preferences",
  description: "Trích xuất thông tin người dùng trong quá trình chat onboarding.",
  parameters: userPrefsSchema
};

// --- Hàm hỗ trợ ---

/**
 * Trích xuất JSON từ văn bản (xử lý cả markdown và text thường).
 * Đã thêm logic làm sạch JSON bẩn (comments, dấu phẩy thừa).
 */
const extractJsonFromText = (text: string): any => {
  // Bước 1: Làm sạch cơ bản (Xóa comment style JS)
  let cleanText = text.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  try {
    return JSON.parse(cleanText);
  } catch (e) {
    // Bước 2: Tìm block JSON trong markdown
    const jsonMatch = cleanText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      cleanText = jsonMatch[1];
    } else {
      // Bước 3: Tìm cặp ngoặc {} ngoài cùng
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }
    }

    // Bước 4: Fix lỗi dấu phẩy thừa (Trailing commas) - nguyên nhân crash phổ biến
    cleanText = cleanText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    try {
      return JSON.parse(cleanText);
    } catch (finalError) {
      console.error("KHÔNG THỂ PARSE JSON:", text);
      throw new Error("Lỗi phân tích dữ liệu từ AI.");
    }
  }
};

/**
 * Đảm bảo Plan có đủ các trường cần thiết để không gây crash UI.
 */
const sanitizePlan = (plan: any): TripPlan => {
  if (!plan) throw new Error("Plan được tạo ra bị rỗng");

  // Xử lý tips: chuyển mảng thành chuỗi nếu cần
  let safeTips = "Chúc bạn có chuyến đi vui vẻ!";
  if (plan.tips) {
    if (Array.isArray(plan.tips)) {
      safeTips = plan.tips.join(". ");
    } else {
      safeTips = String(plan.tips);
    }
  }

  return {
    summary: plan.summary || "Kế hoạch du lịch của bạn",
    tips: safeTips,
    stats: {
      totalCost: plan.stats?.totalCost || 0,
      currency: plan.stats?.currency || "VND", // Mặc định VND cho bản Việt hóa
      totalEvents: plan.stats?.totalEvents || 0,
      weatherSummary: plan.stats?.weatherSummary || "Xem dự báo thời tiết",
      durationDays: plan.stats?.durationDays || 1
    },
    itinerary: Array.isArray(plan.itinerary) ? plan.itinerary.map((day: any) => ({
      day: day.day,
      date: day.date || "Chưa xác định",
      theme: day.theme || "Khám phá",
      events: Array.isArray(day.events) ? day.events.map((evt: any) => ({
        ...evt,
        id: evt.id || Math.random().toString(36).substr(2, 9),
        time: evt.time || "09:00", // Định dạng giờ 24h
        locationName: evt.locationName || evt.location || evt.place || "Địa điểm chưa rõ",
        address: evt.address || "",
        status: evt.status || 'accepted',
        type: evt.type || 'activity',
        costEstimate: evt.costEstimate || 0,
        transportMethod: evt.transportMethod || "Tự túc",
        transportDuration: evt.transportDuration || "15 phút"
      })) : []
    })) : []
  };
};

// --- Logic Chính ---

/**
 * 1. TẠO LỊCH TRÌNH (MANUAL GENERATION)
 * Sử dụng Google Search để lấy dữ liệu thật, Prompt tiếng Việt.
 */
export const generateTrip = async (prefs: UserPreferences): Promise<TripPlan> => {
  const budgetText = prefs.exactBudget && prefs.exactBudget > 0
    ? `Ngân sách cứng: ${prefs.exactBudget} ${prefs.currency}`
    : `Mức ngân sách: ${prefs.budget || "Trung bình"}`;

  const partyText = `${prefs.partySize.adults} Người lớn, ${prefs.partySize.children} Trẻ em`;

  // PROMPT TIẾNG VIỆT
  const prompt = `
    Đóng vai một chuyên gia du lịch am hiểu Việt Nam và Quốc tế. Hãy lập một kế hoạch du lịch chi tiết dạng JSON cho:
    Điểm đến: ${prefs.destination}
    Thời gian: ${prefs.startDate} đến ${prefs.endDate}
    Đoàn: ${partyText}
    Phong cách: ${prefs.style.join(", ")}
    ${budgetText}
    Ghi chú thêm: ${prefs.prompt}

    HƯỚNG DẪN TỐC ĐỘ VÀ DỮ LIỆU:
    1. Sử dụng Google Search CHỈ ĐỂ TRA CỨU: Thời tiết thực tế và Giá vé tham quan/máy bay mới nhất.
    2. Với nhà hàng/quán cafe: Sử dụng kiến thức nội tại của bạn để gợi ý các quán ngon, nổi tiếng (Không cần search từng quán để tiết kiệm thời gian).
    3. Ngôn ngữ output: TIẾNG VIỆT.
    4. Cấu trúc ngày: Phải có đủ Sáng, Trưa, Chiều, Tối. Đừng để trống.

    Cấu trúc JSON bắt buộc (Không kèm text dẫn chuyện):
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
                    "description": "Mô tả ngắn", "costEstimate": 0, "type": "activity/food/lodging"
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
        // Bật Google Search cho lần tạo đầu tiên để lấy dữ liệu nền chuẩn xác
        tools: [{ googleSearch: {} }],
      }
    });

    if (!response.text) throw new Error("AI không trả về dữ liệu.");

    const rawPlan = extractJsonFromText(response.text);
    const plan = sanitizePlan(rawPlan);

    // Khởi tạo Chat Session ngay sau khi tạo xong
    // QUAN TRỌNG: Tắt googleSearch ở đây để tránh lỗi "Tool use with function calling is unsupported"
    tripChatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: `Bạn là trợ lý du lịch ảo thông minh.
                
                QUY TẮC CHỈNH SỬA KẾ HOẠCH (QUAN TRỌNG):
                1. CHỈNH SỬA KHÔNG PHÁ HỦY: Khi user yêu cầu đổi 1 sự kiện, bạn PHẢI GIỮ NGUYÊN tất cả các sự kiện và ngày khác. Copy lại chúng y nguyên.
                2. KHÔNG TÓM TẮT: Trả về JSON đầy đủ, không được cắt bớt.
                3. Luôn gọi hàm 'update_itinerary' với JSON đầy đủ.
                4. Sử dụng kiến thức nội tại để recommend (Không dùng Search trong lúc chat để phản hồi nhanh).
                5. Giao tiếp bằng TIẾNG VIỆT.`,
        tools: [{ functionDeclarations: [updateItineraryTool] }]
      },
      history: [
        { role: 'user', parts: [{ text: "Đây là kế hoạch vừa tạo. Tôi đã sẵn sàng xem xét." }] },
        { role: 'model', parts: [{ text: "Tuyệt vời! Kế hoạch đã sẵn sàng. Bạn có muốn thay đổi gì không?" }] }
      ]
    });

    return plan;

  } catch (error) {
    console.error("Lỗi tạo lịch trình:", error);
    throw error;
  }
};

/**
 * 2. CHAT SỬA LỊCH TRÌNH (MODIFY TRIP)
 * Đã tắt Search để fix lỗi 400 và tăng tốc độ.
 */
export const sendChatMessage = async (message: string, currentPlan: TripPlan): Promise<{ text: string, updatedPlan?: TripPlan }> => {
  // Logic tái khởi tạo session nếu bị mất (F5 trang)
  if (!tripChatSession) {
    console.warn("Session bị mất, đang khôi phục với ngữ cảnh hiện tại...");
    tripChatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: `Bạn là trợ lý du lịch. User đang xem một kế hoạch có sẵn.
                Nhiệm vụ: Sửa đổi kế hoạch theo yêu cầu.
                Quy tắc: Trả về FULL JSON, không cắt bớt. Giao tiếp Tiếng Việt.`,
        tools: [{ functionDeclarations: [updateItineraryTool] }]
      },
      history: [
        { role: 'user', parts: [{ text: `Đây là dữ liệu JSON của kế hoạch hiện tại: ${JSON.stringify(currentPlan)}` }] },
        { role: 'model', parts: [{ text: "Đã hiểu ngữ cảnh. Tôi sẵn sàng chỉnh sửa." }] }
      ]
    });
  }

  try {
    // 1. Gửi tin nhắn User
    const result = await tripChatSession.sendMessage({ message });

    let responseText = result.text || "";
    let updatedPlan: TripPlan | undefined;

    // 2. Kiểm tra Function Calling
    const toolCalls = result.functionCalls;

    if (toolCalls && toolCalls.length > 0) {
      for (const call of toolCalls) {
        if (call.name === 'update_itinerary') {
          console.log("🛠️ AI đang cập nhật lịch trình...");

          try {
            const rawUpdated = call.args as unknown as TripPlan;

            // Kiểm tra an toàn dữ liệu
            if (!rawUpdated.itinerary || rawUpdated.itinerary.length === 0) {
              throw new Error("AI trả về lịch trình rỗng.");
            }

            updatedPlan = sanitizePlan(rawUpdated);

            // 3. Gửi kết quả Tool về lại cho AI (Bắt buộc để đóng vòng lặp chat)
            const toolResponse = await tripChatSession.sendMessage({
              message: [{
                functionResponse: {
                  name: call.name,
                  response: { result: "Cập nhật thành công." },
                  id: call.id
                }
              }]
            });

            // 4. Lấy câu trả lời text cuối cùng
            if (toolResponse.text) {
              responseText = toolResponse.text;
            } else {
              responseText = "Đã cập nhật kế hoạch theo ý bạn!";
            }

          } catch (err) {
            console.error("Lỗi xử lý tool output:", err);
            responseText = "Tôi đã thử cập nhật nhưng gặp lỗi định dạng dữ liệu. Vui lòng thử lại câu lệnh đơn giản hơn.";
          }
        }
      }
    }

    return { text: responseText, updatedPlan };

  } catch (error) {
    console.error("Lỗi Chat:", error);
    return { text: "Xin lỗi, hiện tại tôi không thể kết nối với hệ thống AI." };
  }
};

/**
 * 3. ONBOARDING CHAT (Hỏi thông tin ban đầu)
 * Tiếng Việt hóa.
 */
export const startOnboardingChat = () => {
  onboardingChatSession = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: `Bạn là nhân viên tư vấn du lịch. Hãy phỏng vấn người dùng để lên kế hoạch.
            Hỏi TỪNG CÂU MỘT.
            Mục tiêu thu thập: Điểm đến, Ngày đi/về, Số người, Ngân sách, Sở thích.
            Mỗi khi có thông tin mới, hãy gọi hàm 'update_user_preferences'.
            KHÔNG BAO GIỜ tự viết ra lịch trình text. Chỉ thu thập dữ liệu.
            Ngôn ngữ: Tiếng Việt.`,
      tools: [{ functionDeclarations: [updateUserPrefsTool] }]
    }
  });
  return "Xin chào! Tôi là trợ lý du lịch AI. Bạn dự định đi đâu trong chuyến đi sắp tới?";
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
                response: { result: "Đã lưu thông tin." },
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
    return { text: "Xin lỗi, tôi chưa nghe rõ. Bạn nhắc lại được không?" };
  }
};

/**
 * 4. TÁI TẠO CÁC SỰ KIỆN BỊ TỪ CHỐI
 */
export const updateTrip = async (currentPlan: TripPlan, rejectedIds: string[]): Promise<TripPlan> => {
  if (!tripChatSession) throw new Error("Mất kết nối session");

  const prompt = `Người dùng đã từ chối các sự kiện có ID: ${rejectedIds.join(", ")}. 
    Hãy thay thế chúng bằng các hoạt động/nhà hàng khác phù hợp hơn.
    QUAN TRỌNG: Trả về JSON ĐẦY ĐỦ bao gồm cả những phần không đổi.`;

  const { updatedPlan } = await sendChatMessage(prompt, currentPlan);
  if (!updatedPlan) throw new Error("Không thể tái tạo sự kiện");

  return updatedPlan;
};


import { GoogleGenAI, Type, Schema, Chat, FunctionDeclaration } from "@google/genai";
import { UserPreferences, TripPlan, TravelStyle } from "../types/types";

// Use NEXT_PUBLIC_ prefix for Client Component visibility in Next.js
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_AGENT_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

// --- Schema Definitions ---
const eventSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Unique UUID for the event" },
    time: { type: Type.STRING, description: "Time of day (e.g., 09:00 AM)" },
    activity: { type: Type.STRING, description: "Short title of activity" },
    locationName: { type: Type.STRING, description: "Name of the place/venue" },
    address: { type: Type.STRING, description: "Real, specific physical address for Google Maps navigation" },
    phoneNumber: { type: Type.STRING, description: "Contact phone number (if applicable/available)" },
    website: { type: Type.STRING, description: "Official website URL (if applicable)" },
    description: { type: Type.STRING, description: "2 sentence description explaining why this place is chosen." },
    costEstimate: { type: Type.NUMBER, description: "Estimated cost per person (numeric only)" },
    currency: { type: Type.STRING, description: "Currency code (e.g., USD, VND)" },
    transportMethod: { type: Type.STRING, description: "How to get here from previous location" },
    transportDuration: { type: Type.STRING, description: "Estimated travel time" },
    type: { type: Type.STRING, description: "One of: activity, food, lodging, transport" },
    status: { type: Type.STRING, description: "Always set to 'accepted' initially" }
  },
  required: ["id", "time", "activity", "locationName", "address", "costEstimate", "type"]
};

const daySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    day: { type: Type.INTEGER },
    date: { type: Type.STRING },
    theme: { type: Type.STRING, description: "Theme of the day" },
    events: {
      type: Type.ARRAY,
      items: eventSchema
    }
  },
  required: ["day", "events"]
};

const tripPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A short engaging summary of the trip" },
    tips: { type: Type.STRING, description: "3 essential tips for this specific trip. Sentences separated by periods." },
    stats: {
      type: Type.OBJECT,
      properties: {
        totalCost: { type: Type.NUMBER },
        currency: { type: Type.STRING },
        totalEvents: { type: Type.INTEGER },
        weatherSummary: { type: Type.STRING, description: "Expected weather forecast" },
        durationDays: { type: Type.INTEGER }
      },
      required: ["totalCost", "weatherSummary"]
    },
    itinerary: {
      type: Type.ARRAY,
      items: daySchema
    }
  },
  required: ["summary", "itinerary", "stats"]
};

// --- Tool Definition for Updating Itinerary ---
const updateItineraryTool: FunctionDeclaration = {
    name: "update_itinerary",
    description: "Call this function ONLY when you need to modify, add, or remove events in the travel plan based on user request. Return the FULL updated trip plan.",
    parameters: tripPlanSchema // We use the full schema to ensure we get a complete state back
};

let chatSession: Chat | null = null;

/**
 * Generates the initial trip and initializes the Chat Session.
 */
export const generateTrip = async (prefs: UserPreferences): Promise<TripPlan> => {
  const prompt = `
    Act as an expert travel agent. Plan a detailed trip to ${prefs.destination}.
    Dates: ${prefs.startDate} to ${prefs.endDate}.
    Styles: ${prefs.style.join(", ")}.
    User Note: ${prefs.prompt}.
    Budget Constraint: ${prefs.budget || "Moderate"}.
    
    CRITICAL DATA REQUIREMENTS:
    1. Provide REAL specific addresses for every location.
    2. Estimate costs accurately in ${prefs.destination}'s local currency or USD.
    3. Include official websites or phone numbers where possible.
    4. Ensure logical transport times between specific addresses.
    5. Generate unique IDs for every event.
  `;

  try {
    // Initial Generation - we use generateContent to get the structured data strictly first.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: tripPlanSchema,
      },
    });

    if (!response.text) throw new Error("No content generated");
    const initialPlan = JSON.parse(response.text) as TripPlan;

    // Initialize Chat Session with the context of the created plan
    chatSession = ai.chats.create({
        model: MODEL_NAME,
        config: {
            systemInstruction: `You are a smart travel assistant. 
            Context: User is currently viewing a travel plan you created.
            Goal: Help refine the plan.
            
            Token Saving Rules:
            1. Be concise in text responses.
            2. When the user asks for a change to the schedule, DO NOT explain what you are doing. Just call the 'update_itinerary' tool immediately.
            3. Only output text if the user asks a question (e.g., "Is it cold?").
            
            Data Rules:
            1. Always maintain valid JSON for the tool.
            2. Keep addresses and contact info accurate when updating.`,
            tools: [{ functionDeclarations: [updateItineraryTool] }]
        },
        history: [
            { role: 'user', parts: [{ text: prompt }] },
            { role: 'model', parts: [{ text: "Here is your initial plan." }] } // We simulate that the model returned the plan
        ]
    });

    return initialPlan;
  } catch (error) {
    console.error("Trip generation failed:", error);
    throw error;
  }
};

/**
 * Sends a message to the chatbot.
 * Returns text response AND optionally a new TripPlan if the tool was called.
 */
export const sendChatMessage = async (message: string, currentPlan: TripPlan): Promise<{ text: string, updatedPlan?: TripPlan }> => {
    if (!chatSession) {
        throw new Error("Chat session not initialized. Generate a trip first.");
    }

    try {
        const response = await chatSession.sendMessage({ message });
        
        let responseText = response.text || "";
        let updatedPlan: TripPlan | undefined;

        // Check for function calls
        const toolCalls = response.functionCalls;
        if (toolCalls && toolCalls.length > 0) {
            for (const call of toolCalls) {
                if (call.name === 'update_itinerary') {
                    updatedPlan = call.args as unknown as TripPlan;
                    
                    // Send tool execution result back to model to keep history consistent
                    const toolResponse = await chatSession.sendMessage({
                        message: [{
                            functionResponse: {
                                name: call.name,
                                response: { result: "Itinerary updated successfully on client." },
                                id: call.id
                            }
                        }]
                    });
                    
                    // If the model returns a confirmation message, use it. 
                    // Otherwise fallback to default text if original response was empty.
                    if (toolResponse.text) {
                        responseText = toolResponse.text;
                    } else if (!responseText) {
                        responseText = "I've updated your plan.";
                    }
                }
            }
        }

        return { text: responseText, updatedPlan };

    } catch (error) {
        console.error("Chat failed", error);
        return { text: "I'm sorry, I had trouble processing that request." };
    }
}

/**
 * Updates the trip by regenerating rejected events.
 */
export const updateTrip = async (currentPlan: TripPlan, rejectedIds: string[]): Promise<TripPlan> => {
    if (!chatSession) {
        throw new Error("Chat session not initialized. Generate a trip first.");
    }

    const prompt = `
      The user has rejected events with IDs: ${rejectedIds.join(", ")}.
      Replace them with new activities.
      CRITICAL: Include specific Address, Price, and details for new events.
      Call 'update_itinerary'.
    `;

    try {
        const response = await chatSession.sendMessage({ message: prompt });
        let updatedPlan: TripPlan | undefined;

        // Check for function calls
        const toolCalls = response.functionCalls;
        if (toolCalls && toolCalls.length > 0) {
            for (const call of toolCalls) {
                if (call.name === 'update_itinerary') {
                    updatedPlan = call.args as unknown as TripPlan;
                    
                    await chatSession.sendMessage({
                        message: [{
                            functionResponse: {
                                name: call.name,
                                response: { result: "Itinerary updated successfully." },
                                id: call.id
                            }
                        }]
                    });
                }
            }
        }

        if (!updatedPlan) {
             throw new Error("AI did not provide an updated plan.");
        }

        return updatedPlan;

    } catch (error) {
        console.error("Update trip failed", error);
        throw error;
    }
};
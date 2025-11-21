import { toast } from 'react-toastify';

interface TravelPlanRequest {
  startDate: string;
  endDate: string;
  description: string;
}

const showErrorToast = (message: string) => {
  toast.error(message);
};

const generatePrompt = (startDate: string, endDate: string, description: string): string => {
  return `
- Start date: ${startDate}
- End date: ${endDate}
- Description: ${description}
`;
};

export const generateTravelPlan = async ({
  startDate,
  endDate,
  description,
}: TravelPlanRequest): Promise<string> => {
  if (!startDate || !endDate) {
    const errorMessage = 'Vui lòng chọn ngày bắt đầu và kết thúc';
    showErrorToast(errorMessage);
    throw new Error(errorMessage);
  }

  if (!description.trim()) {
    const errorMessage = 'Vui lòng nhập mô tả chuyến đi';
    showErrorToast(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_AGENT_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const prompt = generatePrompt(startDate, endDate, description);
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Status:', response.status);
      console.error('API Error Text:', errorText);
      
      let errorMessage = 'Không thể kết nối đến dịch vụ AI. Vui lòng thử lại sau.';
      
      try {
        const errorData = JSON.parse(errorText);
        console.error('API Error Details:', errorData);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Handle the response based on the Gemini API response format
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text || 'Không thể tạo kế hoạch du lịch. Vui lòng thử lại.';
    } else if (data.error) {
      throw new Error(data.error.message || 'Có lỗi xảy ra khi xử lý yêu cầu.');
    } else {
      return 'Không thể tạo kế hoạch du lịch. Vui lòng thử lại.';
    }
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw new Error('Có lỗi xảy ra. Vui lòng thử lại sau.');
  }
};

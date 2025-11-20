import { toast } from 'react-toastify';

interface TravelPlanRequest {
  startDate: string;
  endDate: string;
  description: string;
}

const showErrorToast = (message: string) => {
  toast.error(message);
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

  try {
    // Replace with your actual API endpoint
    const response = await fetch('YOUR_AI_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        description,
      }),
    });

    if (!response.ok) {
      const errorMessage = 'Không thể kết nối đến máy chủ';
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.plan;
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw new Error('Có lỗi xảy ra. Vui lòng thử lại sau.');
  }
};

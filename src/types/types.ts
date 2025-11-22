
export enum TravelStyle {
  CULTURAL = "Văn hóa",
  ADVENTURE = "Mạo hiểm",
  RELAXING = "Nghỉ dưỡng",
  FOODIE = "Ẩm thực",
  HISTORICAL = "Lịch sử",
  NATURE = "Thiên nhiên",
  LUXURY = "Sang trọng",
  BUDGET = "Tiết kiệm",
  FAMILY = "Gia đình",
  COUPLE = "Cặp đôi",
  SOLO = "Một mình",
  SHOPPING = "Mua sắm",
  NIGHTLIFE = "Về đêm"
}

export interface UserPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  style: TravelStyle[];
  prompt: string;
  budget?: string;
  exactBudget?: number;
  currency?: string;
  partySize: {
    adults: number;
    children: number;
  };
}

export interface UserPreferencesPartial {
  destination?: string;
  startDate?: string;
  endDate?: string;
  style?: TravelStyle[];
  prompt?: string;
  budget?: string;
  exactBudget?: number;
  currency?: string;
  partySize?: {
    adults?: number;
    children?: number;
  };
}

export interface ItineraryEvent {
  id: string;
  time: string;
  endTime?: string;
  activity: string;
  locationName: string;
  address?: string;      // Added: Full physical address
  phoneNumber?: string;  // Added: Contact number
  website?: string;      // Added: Website URL
  description: string;
  costEstimate: number;
  currency: string;
  transportMethod: string;
  transportDuration: string;
  status: 'pending' | 'accepted' | 'rejected';
  type: 'activity' | 'food' | 'lodging' | 'transport';
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  events: ItineraryEvent[];
}

export interface TripStats {
  totalCost: number;
  currency: string;
  totalEvents: number;
  weatherSummary: string;
  durationDays: number;
}

export interface TripPlan {
  summary: string;
  tips: string;
  stats: TripStats;
  itinerary: DayPlan[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isToolOutput?: boolean;
}

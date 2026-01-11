export interface VetChatbotConfig {
  userId?: string;
  userName?: string;
  petName?: string;
  source?: string;
  apiUrl?: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  greeting?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    sessionId: string;
    message: string;
    intent: 'general' | 'appointment_booking';
    isAppointmentFlow: boolean;
  };
}

declare global {
  interface Window {
    VetChatbotConfig?: VetChatbotConfig;
  }
}

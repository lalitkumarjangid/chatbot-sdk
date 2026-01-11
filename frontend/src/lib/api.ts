import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor for adding session ID
api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem("vet-chatbot-session-id");
  if (sessionId) {
    config.headers["X-Session-Id"] = sessionId;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Chat API
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatContext {
  userId?: string;
  userName?: string;
  petName?: string;
  source?: string;
}

export interface SendMessageRequest {
  sessionId?: string;
  message: string;
  context?: ChatContext;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    sessionId: string;
    message: string;
    intent: "general" | "appointment_booking";
    isAppointmentFlow: boolean;
  };
}

export interface ChatHistoryResponse {
  success: boolean;
  data: {
    sessionId: string;
    messages: ChatMessage[];
  };
}

export const chatApi = {
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>("/chat/message", data);
    return response.data;
  },

  getHistory: async (sessionId: string): Promise<ChatHistoryResponse> => {
    const response = await api.get<ChatHistoryResponse>(`/chat/history/${sessionId}`);
    return response.data;
  },

  resetAppointment: async (sessionId: string): Promise<void> => {
    await api.post(`/chat/reset-appointment/${sessionId}`);
  },
};

// Session API
export interface Session {
  sessionId: string;
  userId?: string;
  userName?: string;
  petName?: string;
  source?: string;
  createdAt: string;
}

export interface CreateSessionRequest {
  userId?: string;
  userName?: string;
  petName?: string;
  source?: string;
  context?: Record<string, unknown>;
}

export const sessionApi = {
  create: async (data: CreateSessionRequest = {}): Promise<Session> => {
    const response = await api.post<{ success: boolean; data: Session }>("/sessions", data);
    return response.data.data;
  },

  get: async (sessionId: string): Promise<Session> => {
    const response = await api.get<{ success: boolean; data: Session }>(`/sessions/${sessionId}`);
    return response.data.data;
  },
};

// Appointments API
export interface Appointment {
  id: string;
  sessionId: string;
  ownerName: string;
  petName: string;
  phone: string;
  preferredDateTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

export const appointmentApi = {
  getAll: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ appointments: Appointment[]; total: number }> => {
    const response = await api.get<{
      success: boolean;
      data: Appointment[];
      meta: { total: number };
    }>("/appointments", { params });
    return { appointments: response.data.data, total: response.data.meta.total };
  },

  getUpcoming: async (limit = 10): Promise<Appointment[]> => {
    const response = await api.get<{ success: boolean; data: Appointment[] }>(
      "/appointments/upcoming",
      { params: { limit } }
    );
    return response.data.data;
  },

  cancel: async (id: string): Promise<Appointment> => {
    const response = await api.post<{ success: boolean; data: Appointment }>(
      `/appointments/${id}/cancel`
    );
    return response.data.data;
  },

  update: async (
    id: string,
    data: Partial<Appointment>
  ): Promise<Appointment> => {
    const response = await api.patch<{ success: boolean; data: Appointment }>(
      `/appointments/${id}`,
      data
    );
    return response.data.data;
  },
};

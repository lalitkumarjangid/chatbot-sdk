import { ChatMessage, ChatResponse, VetChatbotConfig } from './types';

const DEFAULT_API_URL = 'http://localhost:5000';

export class ChatAPI {
  private apiUrl: string;
  private context: VetChatbotConfig;

  constructor(config: VetChatbotConfig = {}) {
    this.apiUrl = config.apiUrl || DEFAULT_API_URL;
    this.context = config;
  }

  async sendMessage(sessionId: string | null, message: string): Promise<ChatResponse> {
    const response = await fetch(`${this.apiUrl}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        message,
        context: {
          userId: this.context.userId,
          userName: this.context.userName,
          petName: this.context.petName,
          source: this.context.source,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async getHistory(sessionId: string): Promise<{ messages: ChatMessage[] }> {
    const response = await fetch(`${this.apiUrl}/api/chat/history/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    const data = await response.json();
    return data.data;
  }
}

import { Session, ISession, IMessage } from '../models/Session.js';
import { v4 as uuidv4 } from 'uuid';

export interface CreateSessionInput {
  userId?: string;
  userName?: string;
  petName?: string;
  source?: string;
  context?: Record<string, unknown>;
}

export interface AddMessageInput {
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class SessionService {
  async createSession(input: CreateSessionInput = {}): Promise<ISession> {
    const sessionId = uuidv4();
    
    const session = new Session({
      sessionId,
      userId: input.userId,
      userName: input.userName,
      petName: input.petName,
      source: input.source,
      context: input.context || {},
      messages: [],
    });

    await session.save();
    return session;
  }

  async getSession(sessionId: string): Promise<ISession | null> {
    return Session.findOne({ sessionId });
  }

  async getOrCreateSession(sessionId?: string, input?: CreateSessionInput): Promise<ISession> {
    if (sessionId) {
      const existing = await this.getSession(sessionId);
      if (existing) {
        // Update context if new data provided
        if (input && Object.keys(input).length > 0) {
          if (input.userId) existing.userId = input.userId;
          if (input.userName) existing.userName = input.userName;
          if (input.petName) existing.petName = input.petName;
          if (input.source) existing.source = input.source;
          if (input.context) {
            existing.context = { ...existing.context, ...input.context };
          }
          await existing.save();
        }
        return existing;
      }
    }
    return this.createSession(input);
  }

  async addMessage(input: AddMessageInput): Promise<ISession | null> {
    const message: IMessage = {
      role: input.role,
      content: input.content,
      timestamp: new Date(),
    };

    const session = await Session.findOneAndUpdate(
      { sessionId: input.sessionId },
      { $push: { messages: message } },
      { new: true }
    );

    return session;
  }

  async getMessages(sessionId: string, limit = 50): Promise<IMessage[]> {
    const session = await Session.findOne({ sessionId });
    if (!session) return [];
    
    return session.messages.slice(-limit);
  }

  async getSessionsByUserId(userId: string, limit = 20): Promise<ISession[]> {
    return Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-messages');
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const result = await Session.deleteOne({ sessionId });
    return result.deletedCount > 0;
  }
}

export const sessionService = new SessionService();

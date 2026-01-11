import mongoose, { Document, Schema } from 'mongoose';

// Message subdocument interface
export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Session document interface
export interface ISession extends Document {
  sessionId: string;
  userId?: string;
  userName?: string;
  petName?: string;
  source?: string;
  context?: Record<string, unknown>;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    userName: String,
    petName: String,
    source: String,
    context: {
      type: Schema.Types.Mixed,
      default: {},
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
SessionSchema.index({ createdAt: -1 });
SessionSchema.index({ userId: 1, createdAt: -1 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);

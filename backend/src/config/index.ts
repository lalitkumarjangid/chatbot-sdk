import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vet-chatbot',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  nodeEnv: process.env.NODE_ENV || 'development',
};

export const validateConfig = (): void => {
  if (!config.geminiApiKey) {
    console.warn('Warning: GEMINI_API_KEY is not set. AI features will not work.');
  }
};

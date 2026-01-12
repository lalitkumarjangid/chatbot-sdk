import express from 'express';
import cors from 'cors';
import path from 'path';
import { config, validateConfig } from './config/index.js';
import { connectDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';

// Validate configuration
validateConfig();

// Create Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (config.nodeEnv === 'development') return callback(null, true);
    
    // In production, check against whitelist
    if (config.corsOrigins.includes(origin) || config.corsOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for SDK)
app.use('/static', express.static(path.resolve(process.cwd(), 'public')));

// API routes
app.use('/api', routes);

// Serve SDK script
app.get('/chatbot.js', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public/chatbot.js'));
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start listening
    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📚 API available at http://localhost:${config.port}/api`);
      console.log(`💬 SDK script at http://localhost:${config.port}/chatbot.js`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

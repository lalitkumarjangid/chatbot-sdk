import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from './ChatWidget';
import { VetChatbotConfig } from './types';
import './styles.css';

// Get configuration from global window object
const config: VetChatbotConfig = window.VetChatbotConfig || {};

// Function to initialize the chatbot
function initChatbot() {
  // Check if already initialized
  if (document.getElementById('vet-chatbot-container')) {
    console.warn('Vet Chatbot already initialized');
    return;
  }

  // Create container element
  const container = document.createElement('div');
  container.id = 'vet-chatbot-container';
  document.body.appendChild(container);

  // Render the React app
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget config={config} />
    </React.StrictMode>
  );

  console.log('✅ Vet Chatbot SDK initialized', config.userId ? `for user: ${config.userId}` : '');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}

// Export for programmatic use
export { ChatWidget };
export type { VetChatbotConfig };

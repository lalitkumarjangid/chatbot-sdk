import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
import { config } from '../config/index.js';
import { IMessage } from '../models/Session.js';

// System prompt for veterinary-focused responses
const VETERINARY_SYSTEM_PROMPT = `You are a friendly and knowledgeable veterinary assistant chatbot. Your role is to help pet owners with:

1. **Pet Care**: General advice on caring for dogs, cats, birds, rabbits, and other common pets
2. **Vaccination Schedules**: Information about recommended vaccines and timing
3. **Diet & Nutrition**: Guidance on proper feeding, dietary needs, and food safety
4. **Common Illnesses**: Recognizing symptoms and when to seek veterinary care
5. **Preventive Care**: Tips on maintaining pet health, grooming, exercise, and wellness

IMPORTANT RULES:
- Only answer questions related to veterinary topics and pet care
- If asked about non-veterinary topics, politely decline and redirect to pet-related questions
- Always recommend consulting a licensed veterinarian for serious health concerns
- Never provide specific medication dosages or prescribe treatments
- Be empathetic and supportive to worried pet owners
- Use clear, simple language that pet owners can understand

If a user wants to book an appointment, help them through the process by collecting:
- Pet owner's name
- Pet's name
- Phone number
- Preferred date and time

When you detect appointment booking intent, respond with a JSON block in this format:
\`\`\`json
{"intent": "appointment_booking", "step": "start"}
\`\`\`

For non-veterinary questions, respond politely:
"I'm a veterinary assistant and can only help with pet-related questions. Is there anything about your pet's health, care, or nutrition I can help you with?"`;

// Intent detection patterns
const APPOINTMENT_PATTERNS = [
  /book\s*(an?)?\s*appointment/i,
  /schedule\s*(a|an)?\s*(vet|veterinary)?\s*(visit|appointment|checkup)/i,
  /make\s*(an?)?\s*appointment/i,
  /need\s*(to\s*see|an?\s*appointment|a\s*vet)/i,
  /want\s*(to\s*book|to\s*schedule|an?\s*appointment)/i,
  /set\s*up\s*(an?)?\s*(appointment|visit)/i,
];

export interface ChatResponse {
  message: string;
  intent?: 'general' | 'appointment_booking';
  appointmentStep?: string;
  appointmentData?: Record<string, string>;
}

export interface AppointmentState {
  step: 'idle' | 'askOwnerName' | 'askPetName' | 'askPhone' | 'askDateTime' | 'confirm' | 'complete';
  data: {
    ownerName?: string;
    petName?: string;
    phone?: string;
    preferredDateTime?: string;
  };
}

class GeminiService {
  private model: GenerativeModel | null = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not configured');
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      this.initialized = true;
      console.log('✅ Gemini AI service initialized');
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
    }
  }

  detectAppointmentIntent(message: string): boolean {
    return APPOINTMENT_PATTERNS.some(pattern => pattern.test(message));
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: IMessage[],
    appointmentState?: AppointmentState
  ): Promise<ChatResponse> {
    // Check for appointment intent first
    if (this.detectAppointmentIntent(userMessage) && (!appointmentState || appointmentState.step === 'idle')) {
      return {
        message: "I'd be happy to help you book a veterinary appointment! Let's get started. Could you please tell me your name (the pet owner's name)?",
        intent: 'appointment_booking',
        appointmentStep: 'askOwnerName',
      };
    }

    // Handle appointment flow
    if (appointmentState && appointmentState.step !== 'idle' && appointmentState.step !== 'complete') {
      return this.handleAppointmentFlow(userMessage, appointmentState);
    }

    // If Gemini is not initialized, return a fallback response
    if (!this.initialized || !this.model) {
      return {
        message: "I'm sorry, but I'm having trouble connecting to my knowledge base right now. Please try again later or contact support.",
        intent: 'general',
      };
    }

    try {
      // Build conversation history for context
      const contents: Content[] = conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      // Generate response with system instruction
      const chat = this.model.startChat({
        history: contents.slice(0, -1),
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(
        `${VETERINARY_SYSTEM_PROMPT}\n\nUser message: ${userMessage}`
      );
      
      const response = result.response.text();

      return {
        message: response,
        intent: 'general',
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        intent: 'general',
      };
    }
  }

  private handleAppointmentFlow(userMessage: string, state: AppointmentState): ChatResponse {
    const updatedData = { ...state.data };
    let nextStep = state.step;
    let responseMessage = '';

    switch (state.step) {
      case 'askOwnerName':
        updatedData.ownerName = userMessage.trim();
        nextStep = 'askPetName';
        responseMessage = `Thank you, ${updatedData.ownerName}! What's your pet's name?`;
        break;

      case 'askPetName':
        updatedData.petName = userMessage.trim();
        nextStep = 'askPhone';
        responseMessage = `Great! ${updatedData.petName} is a lovely name. Could you please provide your phone number so we can contact you about the appointment?`;
        break;

      case 'askPhone':
        // Basic phone validation
        const phone = userMessage.replace(/\D/g, '');
        if (phone.length < 10) {
          responseMessage = "That doesn't look like a valid phone number. Please enter a phone number with at least 10 digits.";
          break;
        }
        updatedData.phone = userMessage.trim();
        nextStep = 'askDateTime';
        responseMessage = "When would you like to schedule the appointment? Please provide your preferred date and time (e.g., 'January 15, 2026 at 2:00 PM').";
        break;

      case 'askDateTime':
        updatedData.preferredDateTime = userMessage.trim();
        nextStep = 'confirm';
        responseMessage = `Perfect! Let me confirm your appointment details:\n\n` +
          `👤 **Owner Name:** ${updatedData.ownerName}\n` +
          `🐾 **Pet Name:** ${updatedData.petName}\n` +
          `📞 **Phone:** ${updatedData.phone}\n` +
          `📅 **Preferred Time:** ${updatedData.preferredDateTime}\n\n` +
          `Does everything look correct? Please reply with "yes" to confirm or "no" to start over.`;
        break;

      case 'confirm':
        const confirmation = userMessage.toLowerCase().trim();
        if (confirmation === 'yes' || confirmation === 'confirm' || confirmation === 'correct') {
          nextStep = 'complete';
          responseMessage = `🎉 Your appointment has been booked successfully!\n\n` +
            `We've scheduled a visit for **${updatedData.petName}** on **${updatedData.preferredDateTime}**.\n\n` +
            `You'll receive a confirmation call at ${updatedData.phone}. Is there anything else I can help you with regarding your pet?`;
        } else if (confirmation === 'no' || confirmation === 'cancel' || confirmation === 'start over') {
          nextStep = 'askOwnerName';
          return {
            message: "No problem! Let's start over. Could you please tell me your name?",
            intent: 'appointment_booking',
            appointmentStep: 'askOwnerName',
            appointmentData: {},
          };
        } else {
          responseMessage = 'Please reply with "yes" to confirm the appointment or "no" to start over.';
        }
        break;

      default:
        nextStep = 'idle';
        responseMessage = "Is there anything else I can help you with?";
    }

    return {
      message: responseMessage,
      intent: 'appointment_booking',
      appointmentStep: nextStep,
      appointmentData: updatedData,
    };
  }
}

export const geminiService = new GeminiService();

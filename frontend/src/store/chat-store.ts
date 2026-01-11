import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chatApi, ChatMessage, ChatContext } from "@/lib/api";
import { generateSessionId } from "@/lib/utils";

interface ChatState {
  // State
  sessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  context: ChatContext;

  // Actions
  setSessionId: (id: string) => void;
  setContext: (context: ChatContext) => void;
  sendMessage: (message: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearChat: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: null,
      messages: [],
      isLoading: false,
      error: null,
      isOpen: false,
      context: {},

      // Actions
      setSessionId: (id: string) => set({ sessionId: id }),

      setContext: (context: ChatContext) =>
        set((state) => ({
          context: { ...state.context, ...context },
        })),

      sendMessage: async (message: string) => {
        const { sessionId, context, messages } = get();

        // Add user message optimistically
        const userMessage: ChatMessage = {
          role: "user",
          content: message,
          timestamp: new Date().toISOString(),
        };

        set({
          messages: [...messages, userMessage],
          isLoading: true,
          error: null,
        });

        try {
          const response = await chatApi.sendMessage({
            sessionId: sessionId || undefined,
            message,
            context,
          });

          // Update session ID if new
          if (!sessionId) {
            set({ sessionId: response.data.sessionId });
            localStorage.setItem("vet-chatbot-session-id", response.data.sessionId);
          }

          // Add assistant message
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response.data.message,
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to send message:", error);
          set({
            isLoading: false,
            error: "Failed to send message. Please try again.",
          });
        }
      },

      loadHistory: async () => {
        const { sessionId } = get();
        if (!sessionId) return;

        try {
          const response = await chatApi.getHistory(sessionId);
          set({ messages: response.data.messages });
        } catch (error) {
          console.error("Failed to load history:", error);
        }
      },

      clearChat: () => {
        const newSessionId = generateSessionId();
        localStorage.setItem("vet-chatbot-session-id", newSessionId);
        set({
          sessionId: newSessionId,
          messages: [],
          error: null,
        });
      },

      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

      setOpen: (open: boolean) => set({ isOpen: open }),

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "vet-chatbot-storage",
      partialize: (state) => ({
        sessionId: state.sessionId,
        context: state.context,
      }),
    }
  )
);

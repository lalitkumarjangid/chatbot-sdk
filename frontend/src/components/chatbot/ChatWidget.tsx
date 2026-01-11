"use client";

import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chat-store";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  className?: string;
}

export function ChatWidget({ className }: ChatWidgetProps) {
  const {
    messages,
    isLoading,
    error,
    isOpen,
    sendMessage,
    clearChat,
    toggleOpen,
    setOpen,
    setError,
    loadHistory,
    sessionId,
  } = useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount if session exists
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      loadHistory();
    }
  }, [sessionId, loadHistory, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Floating Button */}
      <Button
        onClick={toggleOpen}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "absolute bottom-0 right-0 w-[380px] max-w-[calc(100vw-2rem)] bg-background rounded-lg shadow-2xl border transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ height: "600px", maxHeight: "calc(100vh - 2rem)" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <ChatHeader
            onClose={() => setOpen(false)}
            onClear={clearChat}
          />

          {/* Messages Area */}
          <ScrollArea className="flex-1 chat-scrollbar">
            <div ref={scrollRef} className="min-h-full">
              {messages.length === 0 ? (
                <WelcomeMessage />
              ) : (
                <div className="divide-y">
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={`${msg.timestamp}-${index}`}
                      role={msg.role}
                      content={msg.content}
                      timestamp={msg.timestamp}
                    />
                  ))}
                  {isLoading && <TypingIndicator />}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setError(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Input Area */}
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            placeholder="Ask about pet care or book an appointment..."
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3 bg-muted/50">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 py-2">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
      </div>
    </div>
  );
}

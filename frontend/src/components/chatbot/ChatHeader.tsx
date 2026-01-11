"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, Minimize2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  onClose: () => void;
  onClear: () => void;
  title?: string;
  subtitle?: string;
}

export function ChatHeader({
  onClose,
  onClear,
  title = "Vet Assistant",
  subtitle = "Ask me about pet care!",
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <span className="text-xl">🐾</span>
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-primary-foreground/80">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                className="h-8 w-8 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Minimize</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

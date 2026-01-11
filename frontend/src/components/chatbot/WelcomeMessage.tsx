"use client";

import React from "react";

const WELCOME_MESSAGE = `Hello! 👋 I'm your virtual veterinary assistant. I'm here to help you with:

• **Pet Care** - General advice for dogs, cats, and other pets
• **Vaccinations** - Recommended schedules and information
• **Diet & Nutrition** - Proper feeding guidance
• **Health Concerns** - Recognizing symptoms and when to see a vet
• **Appointment Booking** - Schedule a visit with our clinic

How can I help you today?`;

export function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="text-6xl">🐾</div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Welcome to VetChat!</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          I&apos;m here to help with your pet care questions and appointment bookings.
        </p>
      </div>
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg max-w-[300px]">
        💡 <strong>Try asking:</strong> &quot;What vaccines does my puppy need?&quot; or &quot;I want to book an appointment&quot;
      </div>
    </div>
  );
}

export { WELCOME_MESSAGE };

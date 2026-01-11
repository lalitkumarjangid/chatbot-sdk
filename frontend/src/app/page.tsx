"use client";

import { ChatWidget } from "@/components/chatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Code, MessageCircle, Calendar, Sparkles, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="px-4 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Google Gemini AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Veterinary Chatbot{" "}
            <span className="text-primary">SDK</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A plug-and-play chatbot widget that answers pet care questions and books veterinary appointments. 
            Embed it on any website with a single script tag.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Try the Demo
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Code className="h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need for veterinary customer support, built right in.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Q&A</CardTitle>
              <CardDescription>
                Answers generic veterinary questions about pet care, vaccinations, diet, and common illnesses.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Appointment Booking</CardTitle>
              <CardDescription>
                Conversational flow to collect owner name, pet name, phone, and preferred date/time.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Single script tag to embed. Optional config object for passing user context.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Integration Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Integration</h2>
            <p className="text-muted-foreground">
              Add the chatbot to your website in seconds.
            </p>
          </div>
          <div className="space-y-8">
            {/* Basic Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Integration</CardTitle>
                <CardDescription>Works out of the box with no configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`<script src="https://your-domain.com/chatbot.js"></script>`}</code>
                </pre>
              </CardContent>
            </Card>

            {/* With Context */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">With User Context (Optional)</CardTitle>
                <CardDescription>Pass contextual data to personalize the experience</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`<script>
  window.VetChatbotConfig = {
    userId: "user_123",
    userName: "John Doe",
    petName: "Buddy",
    source: "marketing-website"
  };
</script>
<script src="https://your-domain.com/chatbot.js"></script>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">REST API</h2>
            <p className="text-muted-foreground">
              Clean, well-documented APIs for chat, sessions, and appointments.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { method: "POST", endpoint: "/api/chat/message", desc: "Send message & get AI response" },
              { method: "GET", endpoint: "/api/chat/history/:sessionId", desc: "Fetch conversation history" },
              { method: "POST", endpoint: "/api/sessions", desc: "Create new session" },
              { method: "GET", endpoint: "/api/appointments", desc: "List all appointments" },
              { method: "POST", endpoint: "/api/appointments", desc: "Create appointment" },
              { method: "GET", endpoint: "/api/appointments/upcoming", desc: "Get upcoming appointments" },
            ].map((api, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Badge variant={api.method === "GET" ? "secondary" : "default"} className="font-mono">
                  {api.method}
                </Badge>
                <div>
                  <code className="text-sm font-medium">{api.endpoint}</code>
                  <p className="text-xs text-muted-foreground">{api.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Express", "MongoDB", "Google Gemini"].map(
              (tech) => (
                <Badge key={tech} variant="outline" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              )
            )}
          </div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <ChatWidget />
    </main>
  );
}

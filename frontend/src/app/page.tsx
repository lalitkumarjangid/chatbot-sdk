"use client";

import { ChatWidget } from "@/components/chatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/ui/code-block";
import { 
  Check, 
  Code, 
  MessageCircle, 
  Calendar, 
  Sparkles, 
  Stethoscope,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Github,
  Terminal,
  Copy,
  ExternalLink,
  PawPrint,
  Bot,
  Clock
} from "lucide-react";
import Link from "next/link";

// Get API URL from environment
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || "https://chatbot-sdk-backend.vercel.app";
  }
  return process.env.NEXT_PUBLIC_API_URL || 
    (window.location.hostname === 'localhost' ? "http://localhost:5001" : "https://chatbot-sdk-backend.vercel.app");
};

const API_URL = getApiUrl();
const SDK_URL = `${API_URL}/chatbot.js`;

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-background">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-muted-foreground">Powered by</span>
              <span className="font-semibold">Google Gemini AI</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Veterinary Chatbot
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                SDK
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              A beautiful, plug-and-play chatbot widget for veterinary clinics. 
              Answer pet care questions and book appointments with a single script tag.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" className="gap-2 h-12 px-6 rounded-full" asChild>
                <Link href="/playground">
                  <MessageCircle className="h-5 w-5" />
                  Try Live Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-12 px-6 rounded-full" asChild>
                <Link href="/admin">
                  <Calendar className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>

            {/* Quick install */}
            <div className="w-full max-w-2xl pt-8">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Quick Install</span>
              </div>
              <CodeBlock 
                code={`<script src="${SDK_URL}"></script>`}
                language="html"
                className="text-left"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for veterinary support
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies and designed for the best user experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Bot,
                title: "AI-Powered Responses",
                description: "Uses Google Gemini to provide accurate, helpful answers about pet health, nutrition, and care.",
                color: "text-violet-500",
                bg: "bg-violet-500/10"
              },
              {
                icon: Calendar,
                title: "Smart Appointment Booking",
                description: "Conversational flow that collects owner name, pet details, phone, and preferred time.",
                color: "text-cyan-500",
                bg: "bg-cyan-500/10"
              },
              {
                icon: Zap,
                title: "One-Line Integration",
                description: "Add to any website with a single script tag. No complex setup required.",
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              {
                icon: Shield,
                title: "Topic Restricted",
                description: "AI stays focused on veterinary topics and politely declines off-topic questions.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              },
              {
                icon: Clock,
                title: "Session Persistence",
                description: "Conversations are saved and restored. Users can continue where they left off.",
                color: "text-pink-500",
                bg: "bg-pink-500/10"
              },
              {
                icon: Globe,
                title: "Modern & Responsive",
                description: "Beautiful floating widget that works perfectly on desktop and mobile devices.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              }
            ].map((feature, i) => (
              <Card key={i} className="border-0 shadow-none bg-background">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Integration</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Add to your website in seconds
              </h2>
              <p className="text-muted-foreground">
                Choose the integration method that works best for you.
              </p>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="configured">With Config</TabsTrigger>
                <TabsTrigger value="react">React / Next.js</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Basic Integration
                    </CardTitle>
                    <CardDescription>
                      Works out of the box with no configuration. Just add one line before {`</body>`}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock 
                      code={`<!-- Add this before </body> -->
<script src="${SDK_URL}"></script>`}
                      language="html"
                      filename="index.html"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="configured" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-violet-500" />
                      With User Context
                    </CardTitle>
                    <CardDescription>
                      Pass contextual data to personalize the chatbot experience for your users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock 
                      code={`<!-- Configuration (must come BEFORE the script) -->
<script>
  window.VetChatbotConfig = {
    apiUrl: "${API_URL}",      // Your backend URL
    userId: "user_123",         // Optional: User ID
    userName: "John Doe",       // Optional: User name
    petName: "Buddy",           // Optional: Pet name
    source: "marketing-website" // Optional: Traffic source
  };
</script>
<script src="${SDK_URL}"></script>`}
                      language="html"
                      filename="index.html"
                      showLineNumbers
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="react" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-cyan-500" />
                      React / Next.js Integration
                    </CardTitle>
                    <CardDescription>
                      Use the useEffect hook to dynamically load the chatbot in your React app.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock 
                      code={`// components/Chatbot.tsx
'use client';

import { useEffect } from 'react';

export default function Chatbot() {
  useEffect(() => {
    // Configure the chatbot
    window.VetChatbotConfig = {
      apiUrl: '${API_URL}'
    };
    
    // Load the SDK
    const script = document.createElement('script');
    script.src = '${SDK_URL}';
    script.async = true;
    document.body.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
      const widget = document.getElementById('vet-chatbot-container');
      if (widget) widget.remove();
    };
  }, []);
  
  return null;
}`}
                      language="jsx"
                      filename="components/Chatbot.tsx"
                      showLineNumbers
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section className="py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">API Reference</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                REST API Endpoints
              </h2>
              <p className="text-muted-foreground">
                Clean, well-documented APIs for chat, sessions, and appointments.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                { method: "POST", endpoint: "/api/chat/message", desc: "Send a message and get AI response" },
                { method: "GET", endpoint: "/api/chat/history/:sessionId", desc: "Fetch conversation history" },
                { method: "GET", endpoint: "/api/sessions/:sessionId", desc: "Get session details" },
                { method: "DELETE", endpoint: "/api/sessions/:sessionId", desc: "Delete a session" },
                { method: "GET", endpoint: "/api/appointments", desc: "List all appointments" },
                { method: "PATCH", endpoint: "/api/appointments/:id/status", desc: "Update appointment status" },
                { method: "DELETE", endpoint: "/api/appointments/:id", desc: "Cancel appointment" },
                { method: "GET", endpoint: "/api/health", desc: "Health check endpoint" },
              ].map((api, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4 p-4 rounded-lg bg-background border hover:border-primary/50 transition-colors"
                >
                  <Badge 
                    variant={api.method === "GET" ? "secondary" : api.method === "DELETE" ? "destructive" : "default"}
                    className="font-mono w-20 justify-center"
                  >
                    {api.method}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-medium text-foreground">{api.endpoint}</code>
                    <p className="text-sm text-muted-foreground truncate">{api.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-background border">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4" />
                <span className="font-medium">Try it out</span>
              </div>
              <CodeBlock 
                code={`curl -X POST ${API_URL}/api/chat/message \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What should I feed my puppy?"}'`}
                language="bash"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conversation Examples */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Examples</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See it in action
              </h2>
              <p className="text-muted-foreground">
                The chatbot handles various scenarios intelligently.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Q&A Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-violet-500" />
                    Veterinary Q&A
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs">You</span>
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2">
                      <p className="text-sm">What vaccines does my puppy need?</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                      <PawPrint className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-violet-500/10 rounded-2xl rounded-tl-none px-4 py-2">
                      <p className="text-sm">Puppies need core vaccines including DHPP (distemper, hepatitis, parvovirus, parainfluenza) and rabies. The first shots start at 6-8 weeks...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Example */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-cyan-500" />
                    Appointment Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs">You</span>
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2">
                      <p className="text-sm">I want to book an appointment</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
                      <PawPrint className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-cyan-500/10 rounded-2xl rounded-tl-none px-4 py-2">
                      <p className="text-sm">I&apos;d be happy to help! What&apos;s your name?</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Tech Stack</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Built with modern technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Next.js 14", color: "bg-black text-white" },
                { name: "TypeScript", color: "bg-blue-600 text-white" },
                { name: "Tailwind CSS", color: "bg-cyan-500 text-white" },
                { name: "shadcn/ui", color: "bg-zinc-900 text-white" },
                { name: "Express.js", color: "bg-zinc-700 text-white" },
                { name: "MongoDB", color: "bg-green-600 text-white" },
                { name: "Google Gemini", color: "bg-violet-600 text-white" },
                { name: "Vite", color: "bg-purple-600 text-white" },
              ].map((tech) => (
                <Badge 
                  key={tech.name} 
                  className={`${tech.color} px-4 py-2 text-sm font-medium`}
                >
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Try the live demo by clicking the chat bubble in the bottom right corner.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="gap-2 h-12 px-8 rounded-full">
                <MessageCircle className="h-5 w-5" />
                Open Chat Demo
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-12 px-8 rounded-full" asChild>
                <Link href="/admin">
                  <Calendar className="h-5 w-5" />
                  View Admin Panel
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-violet-500" />
              <span className="font-semibold">VetChat SDK</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ for pet lovers everywhere
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                API: {API_URL}
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatWidget />
    </main>
  );
}

"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Send, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check,
  MessageCircle,
  Calendar,
  Database,
  Zap,
  Terminal,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";

const getApiUrl = () => {
  if (typeof window === 'undefined') return "https://chatbot-sdk-backend.vercel.app";
  return process.env.NEXT_PUBLIC_API_URL || 
    (window.location.hostname === 'localhost' ? "http://localhost:5001" : "https://chatbot-sdk-backend.vercel.app");
};

const API_URL = getApiUrl();

interface ApiResponse {
  status: number;
  data: unknown;
  time: number;
}

export default function PlaygroundPage() {
  const [chatMessage, setChatMessage] = useState("What vaccines does my puppy need?");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<string>("");
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const executeApi = async (
    method: string,
    endpoint: string,
    body?: object
  ) => {
    setLoading(true);
    setActiveEndpoint(endpoint);
    const startTime = Date.now();
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, options);
      const data = await response.json();
      const time = Date.now() - startTime;
      
      setApiResponse({
        status: response.status,
        data,
        time,
      });
      
      return { success: response.ok, data };
    } catch (error) {
      const time = Date.now() - startTime;
      setApiResponse({
        status: 500,
        data: { error: "Network error", message: String(error) },
        time,
      });
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    // Add user message to history
    setChatHistory(prev => [...prev, { role: "user", content: chatMessage }]);
    
    const result = await executeApi("POST", "/api/chat/message", {
      message: chatMessage,
      sessionId,
    });
    
    if (result.success && result.data?.data) {
      const { sessionId: newSessionId, message } = result.data.data;
      setSessionId(newSessionId);
      setChatHistory(prev => [...prev, { role: "assistant", content: message }]);
    }
    
    setChatMessage("");
    
    // Scroll to bottom
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setSessionId(null);
    setApiResponse(null);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickTests = [
    {
      name: "Health Check",
      method: "GET",
      endpoint: "/api/health",
      description: "Check if the API is running",
    },
    {
      name: "Chat Message",
      method: "POST",
      endpoint: "/api/chat/message",
      body: { message: "What should I feed my cat?", sessionId: null },
      description: "Send a message to the AI",
    },
    {
      name: "List Appointments",
      method: "GET",
      endpoint: "/api/appointments",
      description: "Get all booked appointments",
    },
    {
      name: "Get Session",
      method: "GET",
      endpoint: `/api/sessions/${sessionId || "session-id"}`,
      description: "Get session details",
      disabled: !sessionId,
    },
  ];

  const sampleMessages = [
    "What vaccines does my puppy need?",
    "My cat is scratching furniture, what can I do?",
    "Is chocolate bad for dogs?",
    "I want to book an appointment",
    "What's a good diet for senior dogs?",
    "My rabbit is not eating, what should I do?",
  ];

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">API Playground</h1>
              <p className="text-muted-foreground">Test all endpoints and chat with the AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Connected
            </Badge>
            <Badge variant="secondary">{API_URL}</Badge>
            {sessionId && (
              <Badge variant="outline" className="font-mono text-xs">
                Session: {sessionId.slice(0, 8)}...
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Chat Testing */}
          <div className="space-y-6">
            {/* Live Chat Test */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-violet-500" />
                      Live Chat Test
                    </CardTitle>
                    <CardDescription>
                      Test the chatbot conversation flow in real-time
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleClearChat}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <div 
                  ref={chatContainerRef}
                  className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4 bg-muted/30"
                >
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                      <p className="font-medium">No messages yet</p>
                      <p className="text-sm">Send a message to start testing</p>
                    </div>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {loading && activeEndpoint.includes("chat") && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={loading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sample Messages */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Try these:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleMessages.slice(0, 4).map((msg, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setChatMessage(msg)}
                      >
                        {msg.length > 30 ? msg.slice(0, 30) + "..." : msg}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick API Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Quick Tests
                </CardTitle>
                <CardDescription>
                  One-click API endpoint testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickTests.map((test, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={test.method === "GET" ? "secondary" : "default"}
                        className="font-mono w-16 justify-center"
                      >
                        {test.method}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{test.name}</p>
                        <p className="text-xs text-muted-foreground">{test.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading || test.disabled}
                      onClick={() => executeApi(test.method, test.endpoint, test.body)}
                    >
                      {loading && activeEndpoint === test.endpoint ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Response & Custom Request */}
          <div className="space-y-6">
            {/* API Response */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-cyan-500" />
                      API Response
                    </CardTitle>
                    <CardDescription>
                      View the raw response from the API
                    </CardDescription>
                  </div>
                  {apiResponse && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(apiResponse.data, null, 2))}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {apiResponse ? (
                  <div className="space-y-3">
                    {/* Status Bar */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {apiResponse.status >= 200 && apiResponse.status < 300 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={apiResponse.status >= 200 && apiResponse.status < 300 ? "default" : "destructive"}
                        >
                          {apiResponse.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {apiResponse.time}ms
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {activeEndpoint}
                      </Badge>
                    </div>

                    {/* Response Body */}
                    <ScrollArea className="h-[500px] rounded-lg border bg-zinc-950 p-4">
                      <pre className="text-sm text-zinc-100 font-mono">
                        {JSON.stringify(apiResponse.data, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="h-[500px] flex items-center justify-center border rounded-lg bg-muted/30">
                    <div className="text-center text-muted-foreground">
                      <Terminal className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="font-medium">No response yet</p>
                      <p className="text-sm">Execute an API call to see the response</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Custom Request */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-emerald-500" />
                  Custom Request
                </CardTitle>
                <CardDescription>
                  Build and send custom API requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chat">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Enter your message..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Session ID (optional)</label>
                      <Input
                        value={sessionId || ""}
                        onChange={(e) => setSessionId(e.target.value || null)}
                        placeholder="Auto-generated if empty"
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => executeApi("POST", "/api/chat/message", {
                        message: chatMessage,
                        sessionId,
                      })}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send Message
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="appointments" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => executeApi("GET", "/api/appointments")}
                        disabled={loading}
                      >
                        List All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => executeApi("GET", "/api/appointments?status=pending")}
                        disabled={loading}
                      >
                        Pending Only
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => executeApi("GET", "/api/appointments?status=confirmed")}
                        disabled={loading}
                      >
                        Confirmed
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => executeApi("GET", "/api/appointments?status=completed")}
                        disabled={loading}
                      >
                        Completed
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sessions" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Session ID</label>
                      <Input
                        value={sessionId || ""}
                        onChange={(e) => setSessionId(e.target.value || null)}
                        placeholder="Enter session ID"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => sessionId && executeApi("GET", `/api/sessions/${sessionId}`)}
                        disabled={loading || !sessionId}
                      >
                        Get Session
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => sessionId && executeApi("GET", `/api/chat/history/${sessionId}`)}
                        disabled={loading || !sessionId}
                      >
                        Get History
                      </Button>
                    </div>
                    {!sessionId && (
                      <p className="text-xs text-muted-foreground">
                        💡 Send a chat message first to get a session ID
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Endpoints Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Endpoints Reference</CardTitle>
            <CardDescription>All available endpoints with curl examples</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  method: "POST",
                  endpoint: "/api/chat/message",
                  curl: `curl -X POST ${API_URL}/api/chat/message \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello"}'`,
                },
                {
                  method: "GET",
                  endpoint: "/api/chat/history/:sessionId",
                  curl: `curl ${API_URL}/api/chat/history/{sessionId}`,
                },
                {
                  method: "GET",
                  endpoint: "/api/appointments",
                  curl: `curl ${API_URL}/api/appointments`,
                },
                {
                  method: "PATCH",
                  endpoint: "/api/appointments/:id/status",
                  curl: `curl -X PATCH ${API_URL}/api/appointments/{id}/status \\
  -H "Content-Type: application/json" \\
  -d '{"status": "confirmed"}'`,
                },
                {
                  method: "GET",
                  endpoint: "/api/sessions/:sessionId",
                  curl: `curl ${API_URL}/api/sessions/{sessionId}`,
                },
                {
                  method: "GET",
                  endpoint: "/api/health",
                  curl: `curl ${API_URL}/api/health`,
                },
              ].map((api, i) => (
                <div key={i} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={api.method === "GET" ? "secondary" : api.method === "DELETE" ? "destructive" : "default"}
                      className="font-mono"
                    >
                      {api.method}
                    </Badge>
                    <code className="text-xs text-muted-foreground">{api.endpoint}</code>
                  </div>
                  <pre className="text-xs bg-zinc-950 text-zinc-300 p-2 rounded overflow-x-auto">
                    {api.curl}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

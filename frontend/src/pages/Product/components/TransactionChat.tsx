import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Send } from "lucide-react";

export interface ChatMessage {
  id: number;
  sender: "buyer" | "seller" | "system";
  name?: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

interface TransactionChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  footerText: string;
}

export function TransactionChat({
  messages,
  onSendMessage,
  footerText,
}: TransactionChatProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Card className="border-border sticky top-24">
      <CardHeader className="p-3 border-b -mb-6">
        <CardTitle className="text-lg">Transaction Chat</CardTitle>
        <p className="text-xs text-muted-foreground">
          Communicate securely with the seller
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Chat Messages */}
        <ScrollArea className="h-[calc(90vh-240px)] min-h-[250px] [&_[data-slot=scroll-area-thumb]:hover]:bg-accent/90 z-5">
          <div className="space-y-4 p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === "buyer" ? "flex-row-reverse" : ""
                } ${msg.sender === "system" ? "justify-center" : ""}`}
              >
                {msg.sender !== "system" && (
                  <Avatar className="h-8 w-8 flex-shrink-0 border border-border">
                    <AvatarFallback className="bg-accent/10 text-accent font-semibold text-xs">
                      {(msg.name || "?").substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex-1 max-w-[80%] ${
                    msg.sender === "system" ? "max-w-full" : ""
                  }`}
                >
                  {msg.sender !== "system" && (
                    <div
                      className={`text-xs text-muted-foreground mb-1 ${
                        msg.sender === "buyer" ? "text-right" : ""
                      }`}
                    >
                      {msg.name} • {msg.timestamp}
                    </div>
                  )}

                  <div
                    className={`rounded-lg p-3 text-sm ${
                      msg.sender === "buyer"
                        ? "bg-accent/20 border border-accent/30 text-foreground"
                        : msg.sender === "seller"
                        ? "bg-secondary border border-border"
                        : "bg-blue-500/10 border border-blue-500/30 text-center text-xs text-blue-400"
                    }`}
                  >
                    {msg.message}
                    {msg.sender === "system" && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 -mb-4">
            {footerText}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

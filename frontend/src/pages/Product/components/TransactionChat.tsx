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
import { Send, MessageSquareDashed, Loader2 } from "lucide-react";

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
  onSendMessage: (message: string) => Promise<void>;
  footerText: string;
  isCancelled?: boolean; // Whether transaction is cancelled
  isLoading?: boolean; // Loading state for sending messages
}

const MAX_MESSAGE_LENGTH = 300;

export function TransactionChat({
  messages,
  onSendMessage,
  footerText,
  isCancelled = false,
  isLoading = false,
}: TransactionChatProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    // Client-side validation (backend also validates)
    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
      return;
    }

    try {
      setError(null);
      await onSendMessage(message.trim());
      setMessage(""); // Clear input only on success
    } catch (err) {
      // Keep message in input on error (UX requirement)
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;
  const isNearLimit = remainingChars < 50;
  const isOverLimit = remainingChars < 0;

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
            {messages.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-[200px] text-center">
                <MessageSquareDashed className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No messages yet. Say hello to start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
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
              ))
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          {error && (
            <div className="text-xs text-red-500 mb-2 px-1">{error}</div>
          )}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder={
                  isCancelled
                    ? "Transaction cancelled. Messaging is disabled."
                    : "Type a message..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isCancelled || isLoading}
                className={`pr-16 ${isOverLimit ? "border-red-500" : ""}`}
                maxLength={MAX_MESSAGE_LENGTH + 50} // Allow typing past limit to show error
              />
              {/* Character Counter */}
              {message.length > 0 && !isCancelled && (
                <div
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                    isOverLimit
                      ? "text-red-500 font-semibold"
                      : isNearLimit
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {remainingChars}
                </div>
              )}
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={
                !message.trim() || isCancelled || isLoading || isOverLimit
              }
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
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

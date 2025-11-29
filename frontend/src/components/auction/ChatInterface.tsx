import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Send, Paperclip } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "other";
  senderName: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  currentUserName?: string;
  otherUserName?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  currentUserName = "You",
  otherUserName = "Seller",
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Seller" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm">{otherUserName}</div>
            <div className="text-xs text-green-500 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                  src={
                    message.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderName}`
                  }
                />
                <AvatarFallback>{message.senderName[0]}</AvatarFallback>
              </Avatar>

              {/* Message Bubble */}
              <div
                className={`flex flex-col max-w-[70%] ${
                  message.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {message.senderName}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-amber text-background"
                      : "bg-card border border-border"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card/50">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!messageInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

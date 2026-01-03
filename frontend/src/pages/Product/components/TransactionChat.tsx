import { useState, useRef, useEffect } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Send, MessageSquareDashed, Loader2 } from "lucide-react";
import { formatChatTime, formatFullTimestamp } from "../../../utils/date";

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
  isCancelled?: boolean;
  isLoading?: boolean;
  currentUserRole: "buyer" | "seller"; // Role of the currently logged-in user
}

const MAX_MESSAGE_LENGTH = 300;

export function TransactionChat({
  messages,
  onSendMessage,
  footerText,
  isCancelled = false,
  isLoading = false,
  currentUserRole,
}: TransactionChatProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]'
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
      return;
    }

    try {
      setError(null);
      await onSendMessage(message.trim());
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;
  const isNearLimit = remainingChars < 50;
  const isOverLimit = remainingChars < 0;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="border-border sticky top-24">
        <CardHeader className="p-3 border-b -mb-6">
          <CardTitle className="text-lg">Transaction Chat</CardTitle>
          <p className="text-xs text-muted-foreground">
            Communicate securely with the seller
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea
            ref={scrollAreaRef}
            className="h-[calc(90vh-240px)] min-h-[250px] [&_[data-slot=scroll-area-thumb]:hover]:bg-accent/90 z-5"
          >
            <div className="space-y-0 px-4 py-4">
              {" "}
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <MessageSquareDashed className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Say hello to start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  // Check if this message was sent by the current user
                  const isCurrentUser = msg.sender === currentUserRole;
                  const isSystem = msg.sender === "system";

                  const prevMsg = messages[index - 1];
                  const nextMsg = messages[index + 1];

                  const isPrevSame =
                    prevMsg && prevMsg.sender === msg.sender && !isSystem;
                  const isNextSame =
                    nextMsg && nextMsg.sender === msg.sender && !isSystem;

                  const isFirstInGroup = !isPrevSame;
                  const isLastInGroup = !isNextSame;
                  const isMiddleInGroup = isPrevSame && isNextSame;

                  const showAvatar = isLastInGroup;

                  const showHeader = isFirstInGroup;

                  let borderRadiusClass = "rounded-2xl";
                  if (!isSystem) {
                    if (isCurrentUser) {
                      if (isMiddleInGroup) borderRadiusClass += " rounded-r-sm";
                      else if (isFirstInGroup && !isLastInGroup)
                        borderRadiusClass += " rounded-br-sm";
                      else if (!isFirstInGroup && isLastInGroup)
                        borderRadiusClass += " rounded-tr-sm";
                    } else {
                      if (isMiddleInGroup) borderRadiusClass += " rounded-l-sm";
                      else if (isFirstInGroup && !isLastInGroup)
                        borderRadiusClass += " rounded-bl-sm";
                      else if (!isFirstInGroup && isLastInGroup)
                        borderRadiusClass += " rounded-tl-sm";
                    }
                  }

                  const marginTopClass = isFirstInGroup ? "mt-4" : "mt-[2px]";

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 items-end ${
                        isCurrentUser ? "flex-row-reverse" : ""
                      } ${
                        isSystem ? "justify-center mt-4 mb-4" : marginTopClass
                      }`}
                    >
                      {!isSystem && (
                        <div
                          className={`flex-shrink-0 w-8 ${
                            showAvatar ? "mb-5" : ""
                          }`}
                        >
                          {showAvatar ? (
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarFallback className="bg-accent/10 text-accent font-semibold text-xs">
                                {(msg.name || "?")
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8" />
                          )}
                        </div>
                      )}

                      <div
                        className={`flex flex-col max-w-[75%] ${
                          isSystem ? "max-w-full" : ""
                        } ${isCurrentUser ? "items-end" : "items-start"}`}
                      >
                        {!isSystem && showHeader && (
                          <div
                            className={`text-xs text-muted-foreground mb-1 ml-1 ${
                              isCurrentUser ? "text-right mr-1" : ""
                            }`}
                          >
                            {msg.name}
                          </div>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`px-4 py-2 text-sm shadow-sm transition-all ${borderRadiusClass} ${
                                isCurrentUser
                                  ? "bg-primary text-primary-foreground"
                                  : isSystem
                                  ? "bg-muted/50 text-muted-foreground text-center text-xs rounded-full px-3 py-1 shadow-none"
                                  : "bg-secondary border border-border/50 text-secondary-foreground"
                              }`}
                            >
                              {msg.message}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{formatFullTimestamp(msg.timestamp)}</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Timestamp (Optional) */}
                        {isLastInGroup && !isSystem && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`text-[10px] text-muted-foreground/60 mt-1 mx-1 cursor-default`}
                              >
                                {formatChatTime(msg.timestamp)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{formatFullTimestamp(msg.timestamp)}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

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
                  className={`pr-16 rounded-full ${
                    isOverLimit ? "border-red-500" : ""
                  }`}
                  maxLength={MAX_MESSAGE_LENGTH + 50}
                />
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
                className="rounded-full"
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
            <p className="text-xs text-muted-foreground mt-2 -mb-4 pl-2">
              {footerText}
            </p>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

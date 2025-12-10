import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Textarea } from "../../../components/ui/textarea";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { MessageCircle, Plus, Check, X, User, Loader2 } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { BidHistory } from "../../../components/auction/BidHistory";
import { usePermission } from "../../../hooks/usePermission";
import type {
  BidHistoryResponse,
  QuestionsResponse,
} from "../../../types/product";
import { useAuth } from "../../../hooks/useAuth";
import { notify } from "../../../utils/toast";

interface AdditionalInfo {
  id: string;
  content: string;
  createdAt: string;
}

interface ProductTabsProps {
  descriptions: {
    content: string;
    createdAt: string;
  }[];
  bids?: BidHistoryResponse | null;
  questions?: QuestionsResponse | null;
  onAppendDescription?: (content: string) => Promise<void>;
  onAppendQuestion?: (
    content: string,
    questioner: number | undefined
  ) => Promise<void>;
  onAppendAnswer?: (
    content: string,
    questionId: number | undefined,
    answerBy: number | undefined
  ) => Promise<void>;
}

export function ProductTabs({
  descriptions = [],
  bids,
  questions,
  onAppendDescription,
  onAppendQuestion,
  onAppendAnswer,
}: ProductTabsProps) {
  const { hasRole } = usePermission();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  // Temporary state to manage appended descriptions
  const [additionalInfos, setAdditionalInfos] = useState<AdditionalInfo[]>([]);

  // Q&A State
  const [questionText, setQuestionText] = useState("");
  const [isQuestionFocused, setIsQuestionFocused] = useState(false);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  // Seller Reply State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState<string | null>(
    null
  );

  const handleStartReply = (questionId: string) => {
    setReplyingToId(questionId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyText("");
  };

  const handleSubmitReply = async (questionId: string) => {
    if (!replyText.trim() || !onAppendAnswer) return;

    try {
      setIsSubmittingReply(questionId);
      await onAppendAnswer(replyText, Number(questionId), user?.id);
      notify.success("Reply submitted successfully");
      handleCancelReply();
    } catch (error) {
      console.error(error);
      notify.error("Failed to submit reply. Please try again.");
    } finally {
      setIsSubmittingReply(null);
    }
  };

  const handleAskQuestion = async () => {
    if (!questionText.trim() || !onAppendQuestion) return;

    try {
      setIsAskingQuestion(true);
      await onAppendQuestion(questionText, user?.id);
      notify.success("Question posted successfully");
      setQuestionText("");
      setIsQuestionFocused(false);
    } catch (error) {
      console.error(error);
      notify.error("Failed to post question. Please try again.");
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleSave = async () => {
    if (!editorContent.trim()) return;

    // Keep existing description logic as requested
    const newInfo: AdditionalInfo = {
      id: Date.now().toString(),
      content: editorContent,
      createdAt: new Date().toISOString(),
    };

    setAdditionalInfos((prev) => [...prev, newInfo]);
    setEditorContent("");
    setIsEditing(false);

    if (onAppendDescription) {
      await onAppendDescription(editorContent);
    }
  };

  const handleCancel = () => {
    setEditorContent("");
    setIsEditing(false);
  };

  const handleAddInfoClick = () => {
    setEditorContent("");
    setIsEditing(true);
  };

  const mainDescription = descriptions.length > 0 ? descriptions[0] : null;
  const historyDescriptions =
    descriptions.length > 1 ? descriptions.slice(1) : [];

  const allUpdates = [
    ...historyDescriptions.map((desc, index) => ({
      id: `server-${index}`,
      content: desc.content,
      createdAt: desc.createdAt,
    })),
    ...additionalInfos,
  ];

  return (
    <Tabs defaultValue="description" className="mb-12">
      <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="history">Bid History</TabsTrigger>
        <TabsTrigger value="qa">
          Q&A ({questions?.pagination.total || 0})
        </TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description" className="space-y-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Description</CardTitle>
            {hasRole("seller") && !isEditing && (
              <Button variant="outline" size="sm" onClick={handleAddInfoClick}>
                <Plus className="mr-2 h-4 w-4" />
                Add Information
              </Button>
            )}
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Original Description */}
            <div className="prose prose-invert max-w-none">
              {mainDescription ? (
                <div
                  dangerouslySetInnerHTML={{ __html: mainDescription.content }}
                />
              ) : (
                <p className="text-muted-foreground italic">
                  No description available.
                </p>
              )}
            </div>

            {/* Additional Information List */}
            {allUpdates.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-lg font-medium">Updates</h4>
                {allUpdates.map((info) => (
                  <div
                    key={info.id}
                    className="bg-secondary/20 p-4 rounded-lg border border-border"
                  >
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] h-5">
                        Update
                      </Badge>
                      {new Date(info.createdAt).toLocaleString()}
                    </div>
                    <div
                      className="prose prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: info.content }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Editor for New Information */}
            {isEditing && (
              <div className="pt-4 border-t border-border animate-in fade-in zoom-in-95 duration-200">
                <h4 className="text-sm font-medium mb-2">New Information</h4>
                <div className="h-64 mb-12">
                  <ReactQuill
                    theme="snow"
                    value={editorContent}
                    onChange={setEditorContent}
                    className="h-full"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image"],
                        ["clean"],
                      ],
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Bid History Tab */}
      <TabsContent value="history" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Bid History</CardTitle>
            <CardDescription>
              Complete history of all bids placed on this auction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BidHistory
              bids={(bids?.bids || []).map((b) => ({
                id: b.bidId.toString(),
                timestamp: b.bidTime,
                bidder: b.bidder,
                amount: b.amount,
                isTopBid: b.isTopBid,
              }))}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Q&A Tab */}
      <TabsContent value="qa" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Questions & Answers</CardTitle>
            <CardDescription>
              Ask the seller a question about this item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ask Question Input */}
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Ask a question about this product..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    onFocus={() => setIsQuestionFocused(true)}
                    disabled={isAskingQuestion}
                    className="min-h-[60px] resize-none bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                  />

                  {(isQuestionFocused || questionText.length > 0) && (
                    <div className="flex justify-end gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isAskingQuestion}
                        onClick={() => {
                          setIsQuestionFocused(false);
                          setQuestionText("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={!questionText.trim() || isAskingQuestion}
                        onClick={handleAskQuestion}
                      >
                        {isAskingQuestion ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post Question"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Q&A List */}
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={(questions?.questions || []).map((q) =>
                q.questionId.toString()
              )}
            >
              {(questions?.questions || []).map((qa) => {
                const isReplying = replyingToId === qa.questionId.toString();
                const isSubmittingThisReply =
                  isSubmittingReply === qa.questionId.toString();

                return (
                  <AccordionItem
                    key={qa.questionId}
                    value={qa.questionId.toString()}
                  >
                    <AccordionTrigger className="text-left">
                      <div className="flex-1">
                        <div className="text-sm pr-4">{qa.question}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Asked by {qa.askedBy} •{" "}
                          {new Date(qa.askedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {qa.answer ? (
                        <div className="pl-4 border-l-2 border-accent/30 py-2">
                          <div className="flex items-start gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="text-xs border-accent/50 text-accent"
                            >
                              Seller Response
                            </Badge>
                            <span className="text-[10px] text-muted-foreground pt-0.5">
                              {new Date(
                                qa.answer.answeredAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {qa.answer.answer}
                          </p>
                        </div>
                      ) : isReplying ? (
                        // Facebook-style Reply Input
                        <div className="pl-4 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex gap-4">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage
                                src="/placeholder-seller.jpg"
                                alt="@seller"
                              />
                              <AvatarFallback className="bg-accent/10 text-accent">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                disabled={!!isSubmittingThisReply}
                                className="min-h-[50px] resize-none bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-accent/50 transition-all text-sm"
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={!!isSubmittingThisReply}
                                  onClick={handleCancelReply}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={
                                    !replyText.trim() || !!isSubmittingThisReply
                                  }
                                  onClick={() =>
                                    handleSubmitReply(qa.questionId.toString())
                                  }
                                >
                                  {isSubmittingThisReply ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Replying...
                                    </>
                                  ) : (
                                    "Reply"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : hasRole("seller") ? (
                        <div className="pl-4 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              handleStartReply(qa.questionId.toString())
                            }
                          >
                            <MessageCircle className="mr-2 h-3 w-3" />
                            Reply
                          </Button>
                        </div>
                      ) : (
                        <div className="pl-4 py-2 text-sm text-muted-foreground italic">
                          No answer yet.
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

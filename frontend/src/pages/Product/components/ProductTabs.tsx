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
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { MessageCircle, Plus, Check, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { BidHistory } from "../../../components/auction/BidHistory";
import { usePermission } from "../../../hooks/usePermission";
import type {
  BidHistoryResponse,
  QuestionsResponse,
} from "../../../types/product";

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
}

export function ProductTabs({
  descriptions = [],
  bids,
  questions,
}: ProductTabsProps) {
  const { hasRole } = usePermission();
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  // Temporary state to manage appended descriptions
  const [additionalInfos, setAdditionalInfos] = useState<AdditionalInfo[]>([]);

  const handleSave = () => {
    if (!editorContent.trim()) return;

    const newInfo: AdditionalInfo = {
      id: Date.now().toString(),
      content: editorContent,
      createdAt: new Date().toISOString(),
    };

    setAdditionalInfos((prev) => [...prev, newInfo]);
    setEditorContent("");
    setIsEditing(false);
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

  // Combine history from props (server) and additionalInfos (local optimistic)
  // Adapt server history to match AdditionalInfo shape for rendering if needed
  // or just render them in sequence.

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
            {/* 
                Note: The existing BidHistory component expects a different shape.
                We need to adapt our data or update BidHistory.
                Assuming we adapt here for now.
             */}
            <BidHistory
              bids={(bids?.bids || []).map((b) => ({
                id: b.bidId.toString(),
                timestamp: b.bidTime, // Format this if needed
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
            {/* Ask Question */}
            <div className="p-4 rounded-lg border border-border bg-card/50">
              <Button className="w-full" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask a Question
              </Button>
            </div>

            {/* Q&A List */}
            <Accordion type="multiple" className="w-full">
              {(questions?.questions || []).map((qa) => (
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
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {qa.answer.answer}
                        </p>
                      </div>
                    ) : (
                      <div className="pl-4 py-2 text-sm text-muted-foreground italic">
                        No answer yet.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

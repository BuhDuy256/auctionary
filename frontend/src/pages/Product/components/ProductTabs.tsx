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
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { MessageCircle } from "lucide-react";
import { BidHistory } from "../../../components/auction/BidHistory";
import type {
  BidHistoryResponse,
  QuestionsResponse,
} from "../../../types/product";

interface ProductTabsProps {
  description: string;
  bids?: BidHistoryResponse | null;
  questions?: QuestionsResponse | null;
}

export function ProductTabs({
  description,
  bids,
  questions,
}: ProductTabsProps) {
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
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-4">
            <div dangerouslySetInnerHTML={{ __html: description }} />
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

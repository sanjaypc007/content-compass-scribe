
import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ContentItem, useContentStore } from "@/hooks/useContentStore";
import { Calendar, Copy, Star, Trash, LinkedinIcon, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { EmptyState } from "../ui/EmptyState";

const PlatformIcon = ({ platform }: { platform: string }) => {
  return platform === "linkedin" ? (
    <LinkedinIcon className="h-4 w-4" />
  ) : (
    <MessageSquare className="h-4 w-4" />
  );
};

export function HistoryList() {
  const { contentHistory, removeFromHistory, togglePinContent, addToCalendar } = useContentStore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  
  const sortedHistory = [...contentHistory].sort((a, b) => {
    // Sort by pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };
  
  const handleDelete = (id: string) => {
    removeFromHistory(id);
    toast({
      title: "Content Removed",
      description: "The content has been removed from your history.",
    });
  };
  
  const handleTogglePin = (id: string) => {
    togglePinContent(id);
    toast({
      description: "Content pin status updated",
    });
  };
  
  const handleSchedule = (item: ContentItem) => {
    setSelectedItem(item);
    setIsCalendarOpen(true);
  };
  
  const handleAddToCalendar = () => {
    if (selectedItem && selectedDate) {
      addToCalendar({
        ...selectedItem,
        scheduledDate: selectedDate.toISOString(),
      });
      setIsCalendarOpen(false);
      setSelectedDate(undefined);
      setSelectedItem(null);
      
      toast({
        title: "Added to Calendar",
        description: `Content scheduled for ${format(selectedDate, "PPP")}`,
      });
    } else {
      toast({
        title: "Date Required",
        description: "Please select a date for scheduling.",
        variant: "destructive",
      });
    }
  };

  if (contentHistory.length === 0) {
    return <EmptyState title="No History Yet" description="Generated content will appear here" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {sortedHistory.map((item) => (
        <Card 
          key={item.id} 
          className={cn(
            "transition-all hover:shadow-md",
            item.isPinned && "border-primary/50 bg-primary/5"
          )}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  item.platform === "linkedin" ? "bg-blue-100" : "bg-red-100"
                )}>
                  <PlatformIcon platform={item.platform} />
                </div>
                <CardTitle className="text-base">{item.topic}</CardTitle>
              </div>
              <CardDescription>
                {format(new Date(item.createdAt), "MMM d, yyyy")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {item.content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleTogglePin(item.id)}
                className={cn(
                  item.isPinned && "text-yellow-500"
                )}
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDelete(item.id)}
                className="text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleCopy(item.content)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSchedule(item)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
      
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Content</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddToCalendar}>
              Add to Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

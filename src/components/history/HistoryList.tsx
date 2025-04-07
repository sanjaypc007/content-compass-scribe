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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ContentItem, useContentStore } from "@/hooks/useContentStore";
import { Calendar, Copy, Star, Trash2, Edit, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { EmptyState } from "../ui/EmptyState";
import { PlatformIcon } from "@/lib/formatUtils.tsx";
import { formatContent, getFirstLine } from "@/lib/formatUtils";

export function HistoryList() {
  const { contentHistory, removeFromHistory, togglePinContent, addToCalendar, updateHistoryItem } = useContentStore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  
  const sortedHistory = [...contentHistory].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
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

  const handleStartEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditedContent(formatContent(item.content)); 
  };

  const handleSaveEdit = (item: ContentItem) => {
    const updatedItem = { ...item, content: editedContent }; 
    updateHistoryItem(updatedItem);
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved successfully.",
    });
    setEditingId(null);
  };
  
  const handleAddToCalendar = () => {
    if (selectedItem && selectedDate) {
      const contentToSchedule = editingId === selectedItem.id ? editedContent : formatContent(selectedItem.content);
      addToCalendar({
        ...selectedItem,
        content: contentToSchedule,
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
      {sortedHistory.map((item) => {
        const fullFormattedContent = formatContent(item.content);
        const firstLine = getFirstLine(fullFormattedContent);
        
        return (
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
            <CardContent className="pt-2 pb-2">
              {editingId === item.id ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[200px] p-4 text-sm leading-relaxed whitespace-pre-wrap rounded-md border-gray-200"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    color: '#2D3748'
                  }}
                />
              ) : (
                <>
                  <p className="text-sm mb-1">
                    {firstLine || "(No content preview available)"}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground p-0 h-auto"
                    onClick={() => handleStartEdit(item)}
                  >
                    View full content
                  </Button>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleTogglePin(item.id)}
                  title={item.isPinned ? "Unpin" : "Pin"}
                  className={cn(
                    "p-2 h-auto",
                    item.isPinned && "text-yellow-500"
                  )}
                >
                  <Star className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                  className="text-destructive p-2 h-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => editingId === item.id ? handleSaveEdit(item) : handleStartEdit(item)}
                  title={editingId === item.id ? "Save Changes" : "Edit Content"}
                  className={cn(
                    "p-2 h-auto",
                    editingId === item.id ? "text-green-600" : ""
                  )}
                >
                  {editingId === item.id ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(fullFormattedContent)}
                  title="Copy Content"
                  className="p-2 h-auto"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSchedule(item)}
                  title="Schedule Content"
                  className="p-2 h-auto"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
      
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

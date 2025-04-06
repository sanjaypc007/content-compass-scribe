
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { CalendarItem, useContentStore, Platform } from "@/hooks/useContentStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Eye, Trash } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "../ui/EmptyState";

interface CalendarDayProps {
  day: Date;
  items: CalendarItem[];
  onViewItem: (item: CalendarItem) => void;
  onDeleteItem: (id: string) => void;
}

const PlatformBadge = ({ platform }: { platform: Platform }) => {
  return (
    <div className={cn(
      "text-xs px-1 py-0.5 rounded-sm w-16 text-center",
      platform === "linkedin" 
        ? "bg-blue-100 text-blue-700"
        : "bg-red-100 text-red-700"
    )}>
      {platform === "linkedin" ? "LinkedIn" : "Quora"}
    </div>
  );
};

const CalendarDay = ({ day, items, onViewItem, onDeleteItem }: CalendarDayProps) => {
  const isCurrentDay = isToday(day);
  const dayItems = items.filter(item => isSameDay(new Date(item.scheduledDate), day));
  
  return (
    <div className={cn(
      "border rounded-lg p-2 h-32 overflow-hidden",
      isCurrentDay && "bg-primary/5 border-primary/50"
    )}>
      <div className={cn(
        "text-sm font-medium mb-1",
        isCurrentDay && "text-primary font-bold"
      )}>
        {format(day, "d")}
      </div>
      
      <div className="space-y-1 overflow-y-auto max-h-[80px]">
        {dayItems.map(item => (
          <div 
            key={item.id}
            className="flex items-center justify-between bg-card text-xs p-1 rounded"
          >
            <div className="truncate flex-1">{item.topic}</div>
            <div className="flex space-x-1">
              <button 
                onClick={() => onViewItem(item)}
                className="text-gray-500 hover:text-primary"
              >
                <Eye className="h-3 w-3" />
              </button>
              <button 
                onClick={() => onDeleteItem(item.id)}
                className="text-gray-500 hover:text-destructive"
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  const { calendarItems, removeFromCalendar } = useContentStore();
  const { toast } = useToast();
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const handlePreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const handleViewItem = (item: CalendarItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    removeFromCalendar(id);
    toast({
      description: "Item removed from calendar",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {calendarItems.length === 0 ? (
        <EmptyState title="Your Calendar is Empty" description="Schedule content to see it here" />
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium py-1">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days of previous month */}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="border rounded-lg p-2 h-32 bg-muted/20" />
          ))}
          
          {days.map(day => (
            <CalendarDay
              key={day.toISOString()}
              day={day}
              items={calendarItems}
              onViewItem={handleViewItem}
              onDeleteItem={handleDeleteItem}
            />
          ))}
          
          {/* Empty cells for days of next month */}
          {Array.from({ length: 6 - days[days.length - 1].getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="border rounded-lg p-2 h-32 bg-muted/20" />
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedItem && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>{selectedItem.topic}</span>
                <PlatformBadge platform={selectedItem.platform} />
              </DialogTitle>
              <DialogDescription>
                Scheduled for {format(new Date(selectedItem.scheduledDate), "PPP")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
              {selectedItem.content}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteItem(selectedItem.id);
                  setIsDialogOpen(false);
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove from Calendar
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

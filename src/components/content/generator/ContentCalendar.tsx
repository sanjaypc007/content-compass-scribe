
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { CalendarItem } from "@/hooks/useContentStore";

interface ContentCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  handleSchedule: () => void;
  scheduledItems: CalendarItem[];
}

export function ContentCalendar({ 
  selectedDate, 
  setSelectedDate, 
  handleSchedule,
  scheduledItems
}: ContentCalendarProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSchedule}
          disabled={!selectedDate}
          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border pointer-events-auto"
        disabled={(date) => date < new Date()}
      />
      
      {scheduledItems.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Scheduled Content for {format(selectedDate || new Date(), "MMMM d, yyyy")}
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {scheduledItems.map(item => (
              <div key={item.id} className="text-xs p-2 bg-blue-50 rounded border border-blue-100">
                <div className="font-medium">{item.topic}</div>
                <div className="text-gray-500 mt-1">{item.platform === 'linkedin' ? 'LinkedIn' : 'Quora'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

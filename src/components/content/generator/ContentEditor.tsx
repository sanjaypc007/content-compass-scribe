
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Calendar, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useContentStore } from "@/hooks/useContentStore";
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";

interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
  webhookResponse: any;
  useWebhook: boolean;
  onDelete?: () => void;
}

export function ContentEditor({ 
  content, 
  setContent, 
  webhookResponse, 
  useWebhook,
  onDelete 
}: ContentEditorProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const { addToCalendar } = useContentStore();
  
  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast({
        title: "Changes Saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleAddToCalendar = () => {
    setIsCalendarOpen(true);
  };

  const handleCalendarSubmit = () => {
    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select a date for scheduling.",
        variant: "destructive",
      });
      return;
    }

    const calendarItem = {
      id: uuidv4(),
      platform: webhookResponse?.platform || "linkedin",
      topic: webhookResponse?.topic || "Untitled Content",
      content: displayContent,
      createdAt: new Date().toISOString(),
      scheduledDate: selectedDate.toISOString()
    };

    addToCalendar(calendarItem);
    setIsCalendarOpen(false);
    setSelectedDate(undefined);

    toast({
      title: "Added to Calendar",
      description: `Content scheduled for ${format(selectedDate, "PPP")}`,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const formatWebhookContent = (response: any): string => {
    try {
      if (!response) return 'No content available';

      // If response is a string, return it directly
      if (typeof response === 'string') {
        return response;
      }
      
      // If response is an array
      if (Array.isArray(response)) {
        const item = response[0];
        if (!item) return 'No content available';

        // If item is a string
        if (typeof item === 'string') return item;

        // If item has structured content
        if (item.hook || item.body || item.cta || item.hashtags) {
          let content = '';
          if (item.hook) content += item.hook + '\n\n';
          if (item.body) content += item.body + '\n\n';
          if (item.cta) content += item.cta + '\n\n';
          
          if (item.hashtags) {
            let hashtags = item.hashtags;
            if (typeof hashtags === 'string') {
              content += hashtags;
            } else if (Array.isArray(hashtags)) {
              content += hashtags.map((tag: string) => `#${tag.replace(/^#/, '')}`).join(' ');
            }
          }
          
          return content.trim();
        }

        // If item has nested content
        if (item.content) {
          if (typeof item.content === 'string') return item.content;
          if (typeof item.content === 'object') {
            let content = '';
            const { hook, body, cta, hashtags } = item.content;
            
            if (hook) content += hook + '\n\n';
            if (body) content += body + '\n\n';
            if (cta) content += cta + '\n\n';
            
            if (hashtags) {
              if (typeof hashtags === 'string') {
                content += hashtags;
              } else if (Array.isArray(hashtags)) {
                content += hashtags.map((tag: string) => `#${tag.replace(/^#/, '')}`).join(' ');
              }
            }
            
            return content.trim();
          }
        }
        
        return JSON.stringify(item, null, 2);
      }
      
      // Handle direct object response
      if (typeof response === 'object') {
        // LinkedIn specific response
        if (response.platform === 'linkedin' && response.content) {
          if (typeof response.content === 'string') return response.content;
          if (typeof response.content === 'object') {
            let content = '';
            const { hook, body, cta, hashtags } = response.content;
            
            if (hook) content += hook + '\n\n';
            if (body) content += body + '\n\n';
            if (cta) content += cta + '\n\n';
            
            if (hashtags) {
              if (typeof hashtags === 'string') {
                content += hashtags;
              } else if (Array.isArray(hashtags)) {
                content += hashtags.map((tag: string) => `#${tag.replace(/^#/, '')}`).join(' ');
              }
            }
            
            return content.trim();
          }
        }
        
        // Output structure
        if (response.output?.content) {
          let content = '';
          const { hook, body, cta, hashtags } = response.output.content;
          
          if (hook) content += hook + '\n\n';
          if (body) content += body + '\n\n';
          if (cta) content += cta + '\n\n';
          
          if (hashtags) {
            if (typeof hashtags === 'string') {
              content += hashtags;
            } else if (Array.isArray(hashtags)) {
              content += hashtags.map((tag: string) => `#${tag.replace(/^#/, '')}`).join(' ');
            }
          }
          
          return content.trim();
        }

        // Direct content field
        if (response.content) {
          if (typeof response.content === 'string') return response.content;
          if (typeof response.content === 'object') {
            let content = '';
            const { hook, body, cta, hashtags } = response.content;
            
            if (hook) content += hook + '\n\n';
            if (body) content += body + '\n\n';
            if (cta) content += cta + '\n\n';
            
            if (hashtags) {
              if (typeof hashtags === 'string') {
                content += hashtags;
              } else if (Array.isArray(hashtags)) {
                content += hashtags.map((tag: string) => `#${tag.replace(/^#/, '')}`).join(' ');
              }
            }
            
            return content.trim();
          }
        }
        
        // Message field
        if (response.message) return response.message;
        
        // Extract content from common fields
        for (const field of ['text', 'body', 'message', 'response']) {
          if (response[field] && typeof response[field] === 'string') {
            return response[field];
          }
        }
        
        // Fallback
        return JSON.stringify(response, null, 2);
      }
      
      return 'Unable to format content';

    } catch (error) {
      console.error('Error formatting webhook content:', error);
      return 'Error formatting content';
    }
  };

  const displayContent = useWebhook ? formatWebhookContent(webhookResponse) : content || 'No content available';

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-end p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEdit}
            className={`${isEditing ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50'}`}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddToCalendar}
            className="hover:bg-green-50 text-green-600 border-green-200"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="hover:bg-red-50 text-red-600 border-red-200"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <Textarea
          value={displayContent}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isEditing}
          className={`w-full min-h-[300px] resize-none p-6 text-base leading-relaxed whitespace-pre-wrap rounded-md border-gray-200 ${ 
            !isEditing ? 'cursor-default bg-gray-50' : 'bg-white'
          }`}
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#2D3748',
            letterSpacing: '0.1px'
          }}
        />
      </div>

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
            <Button onClick={handleCalendarSubmit}>
              Add to Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

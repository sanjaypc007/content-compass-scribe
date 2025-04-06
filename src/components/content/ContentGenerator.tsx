
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";
import { useContentStore, Platform, ContentItem, CalendarItem } from "@/hooks/useContentStore";
import { useToast } from "@/hooks/use-toast";
import { PlatformSection } from "./generator/PlatformSection";
import { TopicInput } from "./generator/TopicInput";
import { ContentEditor } from "./generator/ContentEditor";
import { ContentCalendar } from "./generator/ContentCalendar";
import { generateAIContent, fetchFromWebhook } from "./generator/contentService";

export function ContentGenerator() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(true);
  const [useWebhook, setUseWebhook] = useState<boolean>(true);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  
  const { toast } = useToast();
  const addToHistory = useContentStore(state => state.addToHistory);
  const addToCalendar = useContentStore(state => state.addToCalendar);
  const calendarItems = useContentStore(state => state.calendarItems);
  
  const handleGenerate = async () => {
    if (!platform) {
      toast({
        title: "Platform Required",
        description: "Please select a platform first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please provide a topic for your content.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      let content = "";
      
      if (useWebhook) {
        // Use webhook for content generation
        const data = await fetchFromWebhook(platform, topic);
        setWebhookResponse(data);
        
        // Extract content from webhook response
        content = data.content || data.message || 
                 (typeof data === 'string' ? data : JSON.stringify(data));
      } else {
        // Use simulated content generation
        content = await generateAIContent(platform, topic);
      }
      
      setGeneratedContent(content);
      
      // Add to history
      const contentItem: ContentItem = {
        id: uuidv4(),
        platform,
        topic,
        content,
        createdAt: new Date().toISOString(),
      };
      
      addToHistory(contentItem);
      
      toast({
        title: "Content Created",
        description: useWebhook ? "Content received from webhook" : "Your content has been successfully generated.",
      });
      
      // Auto-open calendar if not already open
      if (!isCalendarOpen) {
        setIsCalendarOpen(true);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Failed",
        description: `There was an error: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSchedule = () => {
    if (selectedDate) {
      const calendarItem: CalendarItem = {
        id: uuidv4(),
        platform: platform!,
        topic,
        content: generatedContent,
        createdAt: new Date().toISOString(),
        scheduledDate: selectedDate.toISOString(),
      };
      
      addToCalendar(calendarItem);
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

  // Get scheduled items for the selected date
  const getScheduledItemsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return calendarItems.filter(item => {
      const itemDate = new Date(item.scheduledDate);
      return itemDate >= startOfDay && itemDate <= endOfDay;
    });
  };
  
  const scheduledItems = getScheduledItemsForSelectedDate();

  return (
    <div className="space-y-8 animate-fade-in">
      <PlatformSection 
        platform={platform}
        setPlatform={setPlatform}
        useWebhook={useWebhook}
        setUseWebhook={setUseWebhook}
      />
      
      <TopicInput
        topic={topic}
        setTopic={setTopic}
        handleGenerate={handleGenerate}
        isGenerating={isGenerating}
        platform={platform}
        useWebhook={useWebhook}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {generatedContent && (
            <ContentEditor
              content={generatedContent}
              setContent={setGeneratedContent}
              webhookResponse={webhookResponse}
              useWebhook={useWebhook}
            />
          )}
        </div>
        
        <div className="space-y-4">
          <ContentCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleSchedule={handleSchedule}
            scheduledItems={scheduledItems}
          />
        </div>
      </div>
    </div>
  );
}

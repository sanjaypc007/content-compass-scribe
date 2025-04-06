
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PlatformSelector } from "@/components/platforms/PlatformSelector";
import { Platform, useContentStore, ContentItem } from "@/hooks/useContentStore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Calendar, Webhook } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Simulated AI response function for the MVP (to be replaced with real API)
const generateAIContent = async (platform: Platform, topic: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (platform === "linkedin") {
    return `# The Future of ${topic} in the Enterprise\n\nAs organizations continue to adopt ${topic} solutions, we're witnessing a fundamental shift in how businesses operate. Having worked with several Fortune 500 companies implementing ${topic} strategies, I've observed three key trends:\n\n1️⃣ Integration with existing workflows is critical\n2️⃣ Employee training must precede implementation\n3️⃣ ROI metrics need to be established early\n\nWhat challenges has your organization faced when implementing ${topic}? Share your experiences in the comments below!\n\n#${topic.replace(/\s+/g, '')} #BusinessTransformation #DigitalStrategy`;
  } else {
    return `What are the most effective strategies for implementing ${topic} in an enterprise environment?\n\nBased on my experience working with various companies adopting ${topic} solutions, I've found that successful implementation depends on several critical factors:\n\nFirst, executive buy-in is essential. Without clear support from leadership, ${topic} initiatives often struggle to gain traction. The most successful implementations I've seen had C-suite champions who understood both the technical and business implications.\n\nSecond, start with small, high-impact projects. Rather than attempting organization-wide deployment, identify specific use cases where ${topic} can demonstrate clear value. This builds momentum and provides proof points for wider adoption.\n\nFinally, invest in building internal expertise. While external consultants can jump-start your efforts, developing in-house knowledge ensures long-term sustainability.\n\nWhat other factors have you found important when implementing ${topic} solutions?`;
  }
};

// Webhook URL for content generation
const WEBHOOK_URL = "https://pcspace.app.n8n.cloud/webhook-test/53249fb9-c8da-4654-b979-32db120266fe";

export function ContentGenerator() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [useWebhook, setUseWebhook] = useState<boolean>(true);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  
  const { toast } = useToast();
  const addToHistory = useContentStore(state => state.addToHistory);
  const addToCalendar = useContentStore(state => state.addToCalendar);
  
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
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform,
            topic,
            timestamp: new Date().toISOString()
          }),
        });
        
        const data = await response.json();
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
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };
  
  const handleSchedule = () => {
    if (selectedDate) {
      const calendarItem = {
        id: uuidv4(),
        platform,
        topic,
        content: generatedContent,
        createdAt: new Date().toISOString(),
        scheduledDate: selectedDate.toISOString(),
      };
      
      addToCalendar(calendarItem);
      setIsCalendarOpen(false);
      setSelectedDate(undefined);
      
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <PlatformSelector selectedPlatform={platform} onSelectPlatform={setPlatform} />
        
        <div className="flex items-center space-x-2">
          <Switch
            id="webhook-mode"
            checked={useWebhook}
            onCheckedChange={setUseWebhook}
          />
          <Label htmlFor="webhook-mode" className="text-sm font-medium">
            Use webhook for content generation
          </Label>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Topic</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter a topic (e.g., AI Agents, Remote Work, Cloud Migration)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !topic.trim() || !platform}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                {useWebhook ? <Webhook className="mr-2 h-4 w-4" /> : null}
                Generate Content
              </>
            )}
          </Button>
        </div>
      </div>
      
      {generatedContent && (
        <div className="space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated Content</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              
              <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Content</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSchedule}>
                      Add to Calendar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="min-h-[300px] p-4"
            />
          </div>
          
          {useWebhook && webhookResponse && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-2">Webhook Response</h3>
              <pre className="text-xs overflow-auto max-h-[150px]">
                {JSON.stringify(webhookResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

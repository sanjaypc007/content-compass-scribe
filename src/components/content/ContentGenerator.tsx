
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useContentStore, Platform, ContentItem } from "@/hooks/useContentStore";
import { useToast } from "@/hooks/use-toast";
import { PlatformSection } from "./generator/PlatformSection";
import { ContentEditor } from "./generator/ContentEditor";
import { generateAIContent, fetchFromWebhook } from "./generator/contentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { PlatformIcon } from "@/lib/icons";
import { formatContent, getFirstLine } from "@/lib/formatUtils";
import { Link } from "react-router-dom";

export function ContentGenerator() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [useWebhook, setUseWebhook] = useState<boolean>(true);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  
  const { toast } = useToast();
  const { contentHistory, addToHistory } = useContentStore(state => ({ 
    contentHistory: state.contentHistory,
    addToHistory: state.addToHistory 
  }));

  const recentHistory = [...contentHistory]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const handleGenerateContent = async () => {
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
        description: "Please enter a topic to generate content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setContent("");
    setWebhookResponse(null);

    try {
      let generatedContent: string | object = "";
      let rawResponse: any = null;
      
      if (useWebhook) {
        rawResponse = await fetchFromWebhook(platform, topic);
        setWebhookResponse(rawResponse); 
        generatedContent = rawResponse;
      } else {
        const aiContent = await generateAIContent(platform, topic);
        setContent(aiContent);
        generatedContent = aiContent;
      }
      
      const contentItem: ContentItem = {
        id: uuidv4(),
        platform,
        topic,
        content: generatedContent,
        createdAt: new Date().toISOString(),
      };
      
      addToHistory(contentItem);
      
      toast({
        title: "Content Generated",
        description: useWebhook ? "Content received from webhook" : "Your content has been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Failed",
        description: `Failed to generate content. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive",
      });
      setContent(""); 
      setWebhookResponse(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = () => {
    setContent("");
    setWebhookResponse(null);
    toast({
      title: "Content Cleared",
      description: "The current generated content has been cleared.",
    });
  };

  return (
    <div className="space-y-8 p-4 max-w-4xl mx-auto">
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Generate New Content</h2>
        <PlatformSection 
          platform={platform}
          setPlatform={setPlatform}
          useWebhook={useWebhook}
          setUseWebhook={setUseWebhook}
        />
        
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Topic
          </label>
          <div className="flex space-x-2">
            <Input
              id="topic"
              placeholder="Enter your topic (e.g., AI Agents, Remote Work, Cloud Migration)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Content"
              )}
            </Button>
          </div>
        </div>
        
        {(content || webhookResponse) && (
          <div className="mt-4">
            <ContentEditor
              content={content}
              setContent={setContent}
              webhookResponse={webhookResponse}
              useWebhook={useWebhook}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      {recentHistory.length > 0 && (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Generations</h2>
            <Button variant="link" asChild>
              <Link to="/history">View All</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentHistory.map((item) => {
              const formatted = formatContent(item.content);
              const firstLine = getFirstLine(formatted);
              return (
                <Card key={item.id} className="shadow-none border border-gray-100">
                  <CardHeader className="pb-1 pt-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                          item.platform === "linkedin" ? "bg-blue-100" : "bg-red-100"
                        )}>
                          <PlatformIcon platform={item.platform} />
                        </div>
                        <CardTitle className="text-sm font-medium">{item.topic}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        {format(new Date(item.createdAt), "MMM d, HH:mm")}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-3">
                    <p className="text-sm text-muted-foreground truncate">
                      {firstLine || "(No content preview available)"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

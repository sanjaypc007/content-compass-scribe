
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Webhook } from "lucide-react";
import { Platform } from "@/hooks/useContentStore";

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  platform: Platform | null;
  useWebhook: boolean;
}

export function TopicInput({
  topic,
  setTopic,
  handleGenerate,
  isGenerating,
  platform,
  useWebhook
}: TopicInputProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Topic</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Enter a topic (e.g., AI Agents, Remote Work, Cloud Migration)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1 shadow-sm"
        />
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !topic.trim() || !platform}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all"
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
  );
}


import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
  webhookResponse: any;
  useWebhook: boolean;
}

export function ContentEditor({ content, setContent, webhookResponse, useWebhook }: ContentEditorProps) {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Generated Content</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="hover:bg-blue-50"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden shadow-sm">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] p-4"
        />
      </div>
      
      {useWebhook && webhookResponse && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <h3 className="text-sm font-medium mb-2">Webhook Response</h3>
          <pre className="text-xs overflow-auto max-h-[150px] bg-gray-50 p-2 rounded border">
            {JSON.stringify(webhookResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    toast({
      title: "Add to Calendar",
      description: "Content has been added to your calendar.",
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const formatWebhookContent = (response: any) => {
    try {
      console.log('Webhook Response:', response); // Debug log

      if (!response) return 'No content available';

      // If response is a string, format it directly
      if (typeof response === 'string') {
        return response;
      }
      
      // If response is an array (like the LinkedIn example)
      if (Array.isArray(response)) {
        const item = response[0];
        if (!item) return 'No content available';

        // If item is a string
        if (typeof item === 'string') return item;

        // Check if item has the structured content directly (hook, body, etc.)
        if (item.hook || item.body || item.cta || item.hashtags) {
          // Handle comma-separated hashtags string
          let hashtagsArray = item.hashtags;
          if (typeof hashtagsArray === 'string') {
            hashtagsArray = hashtagsArray.split(',').map(tag => tag.trim());
          }
          return formatContentSections(item.hook, item.body, item.cta, hashtagsArray);
        }

        // If item has nested content
        if (item.content) {
          if (typeof item.content === 'string') return item.content;
          if (typeof item.content === 'object') {
            const { hook, body, cta, hashtags } = item.content;
            return formatContentSections(hook, body, cta, hashtags);
          }
        }
        
        return 'Unable to format array item content';
      }
      
      // Handle direct object response (e.g., output structure)
      if (typeof response === 'object') {
        // Handle LinkedIn specific response format (check added for direct object too)
        if (response.platform === 'linkedin' && response.content) {
          if (typeof response.content === 'string') return response.content;
          if (typeof response.content === 'object') {
            const { hook, body, cta, hashtags } = response.content;
             // Handle comma-separated hashtags string
            let hashtagsArray = hashtags;
            if (typeof hashtagsArray === 'string') {
              hashtagsArray = hashtagsArray.split(',').map(tag => tag.trim());
            }
            return formatContentSections(hook, body, cta, hashtagsArray);
          }
        }
        
        // If response has output structure
        if (response.output?.content) {
          const { hook, body, cta, hashtags } = response.output.content;
          return formatContentSections(hook, body, cta, hashtags);
        }

        // If response has direct content field
        if (response.content) {
          if (typeof response.content === 'string') return response.content;
          if (typeof response.content === 'object') {
            const { hook, body, cta, hashtags } = response.content;
            return formatContentSections(hook, body, cta, hashtags);
          }
        }
        
        // If response has message field
        if (response.message) return response.message;
        
        // Try to extract content from common fields
        const extractedContent = extractContentFromObject(response);
        if (extractedContent) return extractedContent;
        
        // Fallback to JSON stringify
        return JSON.stringify(response, null, 2);
      }
      
      return 'Unable to format content';

    } catch (error) {
      console.error('Error formatting webhook content:', error);
      return 'Error formatting content';
    }
  };

  const formatContentSections = (hook?: string, body?: string, cta?: string, hashtags?: string[] | string) => {
    const sections = [];

    if (hook) sections.push(`🎯 Hook:\n${hook}`);
    if (body) sections.push(`📝 Content:\n${body}`);
    if (cta) sections.push(`💡 Call to Action:\n${cta}`);
    
    let formattedHashtags = '';
    if (Array.isArray(hashtags) && hashtags.length > 0) {
      formattedHashtags = hashtags.map(tag => `#${tag.replace(/^#/, '')}`).join(' ');
    } else if (typeof hashtags === 'string' && hashtags.trim()) {
      // Handle case where hashtags might be a single string already
      formattedHashtags = hashtags.split(',').map(tag => `#${tag.trim().replace(/^#/, '')}`).join(' ');
    }
    
    if (formattedHashtags) {
      sections.push(`#️⃣ Tags:\n${formattedHashtags}`);
    }

    return sections.join('\n\n');
  };

  const extractContentFromObject = (obj: any): string | null => {
    const contentFields = ['content', 'body', 'text', 'message'];
    for (const field of contentFields) {
      if (obj[field]) {
        if (typeof obj[field] === 'string') return obj[field];
        if (typeof obj[field] === 'object') {
          const formatted = formatContentSections(
            obj[field].hook,
            obj[field].body,
            obj[field].cta,
            obj[field].hashtags
          );
          if (formatted) return formatted;
        }
      }
    }
    return null;
  };

  const displayContent = useWebhook ? formatWebhookContent(webhookResponse) : content || 'No content available';

  console.log('Display Content:', displayContent); // Debug log

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
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'Save' : 'Edit'}
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
    </div>
  );
}

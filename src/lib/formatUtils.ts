import React from "react";
import { LinkedinIcon, MessageSquare } from "lucide-react";

export const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  return platform === "linkedin" ? (
    <LinkedinIcon className="h-4 w-4" />
  ) : (
    <MessageSquare className="h-4 w-4" />
  );
};

export const formatContent = (content: any): string => {
  try {
    // Try to parse if it's a JSON string
    let parsedContent = content;
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        // If parsing fails, assume it's plain text
        return content;
      }
    }

    // If parsed content is an array, take the first item
    if (Array.isArray(parsedContent)) {
      parsedContent = parsedContent[0];
    }

    // Handle structured content (object)
    if (typeof parsedContent === 'object' && parsedContent !== null) {
      // Handle cases where content might be nested under a 'content' key
      const contentData = parsedContent.content || parsedContent;
      
      // Ensure contentData is an object before destructuring
      if (typeof contentData !== 'object' || contentData === null) {
        return String(content); // Fallback if nested structure is not as expected
      }

      const { hook, body, cta, hashtags } = contentData;
      const sections = [];
      
      if (hook) sections.push(`🎯 Hook:\n${hook}`);
      if (body) sections.push(`📝 Content:\n${body}`);
      if (cta) sections.push(`💡 Call to Action:\n${cta}`);
      
      let formattedHashtags = '';
      if (Array.isArray(hashtags) && hashtags.length > 0) {
        formattedHashtags = hashtags.map(tag => `#${tag.replace(/^#/, '')}`).join(' ');
      } else if (typeof hashtags === 'string' && hashtags.trim()) {
        formattedHashtags = hashtags.split(',').map(tag => `#${tag.trim().replace(/^#/, '')}`).join(' ');
      }
      if (formattedHashtags) {
        sections.push(`#️⃣ Tags:\n${formattedHashtags}`);
      }
      
      // Only join if there are actual sections
      return sections.length > 0 ? sections.join('\n\n') : String(content); 
    }

    // Fallback for non-object, non-string content
    return String(content);
  } catch (error) {
    console.error('Error formatting content:', error);
    // Fallback to original content as string
    return typeof content === 'string' ? content : JSON.stringify(content);
  }
};

export const getFirstLine = (text: string): string => {
  if (!text) return '';
  const lines = text.split('\n');
  // Find the first non-empty line that isn't just an emoji/header
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Check if the line has content and doesn't start with a section header pattern
    if (trimmedLine && !/^([🎯📝💡#️⃣]\s*.*:\n?)/.test(trimmedLine)) {
      return trimmedLine;
    }
    // If it *is* a header line, try to extract the content after the colon
    if (trimmedLine && /^[🎯📝💡#️⃣]/.test(trimmedLine) && trimmedLine.includes(':\n')) {
      const contentPart = trimmedLine.split(':\n')[1]?.trim();
      if (contentPart) return contentPart;
    } 
  }
  // Fallback: return the first non-empty line even if it's a header
  for (const line of lines) {
     const fallbackTrimmed = line.trim();
     if (fallbackTrimmed) return fallbackTrimmed;
  }
  return ''; // Return empty if no content lines found
}; 
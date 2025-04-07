
export const formatContent = (content: any): string => {
  try {
    // If content is already a string, return it
    if (typeof content === 'string') {
      return content;
    }
    
    // Try to parse if it's a JSON string
    let parsedContent = content;
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        // If parsing fails, assume it's already plain text
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
      
      // If contentData is a string, return it
      if (typeof contentData === 'string') {
        return contentData;
      }
      
      // Ensure contentData is an object before destructuring
      if (typeof contentData !== 'object' || contentData === null) {
        return String(content); // Fallback if nested structure is not as expected
      }

      const { hook, body, cta, hashtags } = contentData;
      let result = '';
      
      if (hook) result += hook + '\n\n';
      if (body) result += body + '\n\n';
      if (cta) result += cta + '\n\n';
      
      let formattedHashtags = '';
      if (Array.isArray(hashtags) && hashtags.length > 0) {
        formattedHashtags = hashtags.map(tag => `#${tag.replace(/^#/, '')}`).join(' ');
      } else if (typeof hashtags === 'string' && hashtags.trim()) {
        formattedHashtags = hashtags.split(',').map(tag => `#${tag.trim().replace(/^#/, '')}`).join(' ');
      }
      if (formattedHashtags) {
        result += formattedHashtags;
      }
      
      return result.trim() || String(content);
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
  // Find the first non-empty line
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      return trimmedLine;
    }
  }
  
  return ''; // Return empty if no content lines found
}; 

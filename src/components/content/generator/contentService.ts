
import { Platform, ContentItem } from "@/hooks/useContentStore";

// Webhook URL for content generation
export const WEBHOOK_URL = "https://pcspace.app.n8n.cloud/webhook-test/53249fb9-c8da-4654-b979-32db120266fe";

// Simulated AI response function for the MVP (to be replaced with real API)
export const generateAIContent = async (platform: Platform, topic: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (platform === "linkedin") {
    return `# The Future of ${topic} in the Enterprise\n\nAs organizations continue to adopt ${topic} solutions, we're witnessing a fundamental shift in how businesses operate. Having worked with several Fortune 500 companies implementing ${topic} strategies, I've observed three key trends:\n\n1️⃣ Integration with existing workflows is critical\n2️⃣ Employee training must precede implementation\n3️⃣ ROI metrics need to be established early\n\nWhat challenges has your organization faced when implementing ${topic}? Share your experiences in the comments below!\n\n#${topic.replace(/\s+/g, '')} #BusinessTransformation #DigitalStrategy`;
  } else {
    return `What are the most effective strategies for implementing ${topic} in an enterprise environment?\n\nBased on my experience working with various companies adopting ${topic} solutions, I've found that successful implementation depends on several critical factors:\n\nFirst, executive buy-in is essential. Without clear support from leadership, ${topic} initiatives often struggle to gain traction. The most successful implementations I've seen had C-suite champions who understood both the technical and business implications.\n\nSecond, start with small, high-impact projects. Rather than attempting organization-wide deployment, identify specific use cases where ${topic} can demonstrate clear value. This builds momentum and provides proof points for wider adoption.\n\nFinally, invest in building internal expertise. While external consultants can jump-start your efforts, developing in-house knowledge ensures long-term sustainability.\n\nWhat other factors have you found important when implementing ${topic} solutions?`;
  }
};

// Function to fetch content from webhook
export const fetchFromWebhook = async (platform: Platform, topic: string): Promise<any> => {
  // Use webhook for content generation with GET method
  const queryParams = new URLSearchParams({
    platform,
    topic,
    timestamp: new Date().toISOString()
  }).toString();
  
  const response = await fetch(`${WEBHOOK_URL}?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
};

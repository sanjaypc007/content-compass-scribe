
import { ContentGenerator } from "@/components/content/ContentGenerator";
import { Navbar } from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-contentCompass-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-contentCompass-blue to-contentCompass-purple">
            Content Compass
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            AI-powered content creation for LinkedIn and Quora
          </p>
          
          <ContentGenerator />
        </div>
      </main>
    </div>
  );
};

export default Index;

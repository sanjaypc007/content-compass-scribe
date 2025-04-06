
import { HistoryList } from "@/components/history/HistoryList";
import { Navbar } from "@/components/layout/Navbar";

const History = () => {
  return (
    <div className="min-h-screen flex flex-col bg-contentCompass-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Generation History</h1>
          <p className="text-lg text-muted-foreground mb-8">
            View and manage your previously generated content
          </p>
          
          <HistoryList />
        </div>
      </main>
    </div>
  );
};

export default History;

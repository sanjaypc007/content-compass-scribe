
import { ContentCalendar } from "@/components/calendar/ContentCalendar";
import { Navbar } from "@/components/layout/Navbar";

const Calendar = () => {
  return (
    <div className="min-h-screen flex flex-col bg-contentCompass-background">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule and manage your content
          </p>
          
          <ContentCalendar />
        </div>
      </main>
    </div>
  );
};

export default Calendar;

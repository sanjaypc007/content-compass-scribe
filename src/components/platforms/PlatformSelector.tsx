
import React from "react";
import { Platform } from "@/hooks/useContentStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onSelectPlatform: (platform: Platform) => void;
}

export function PlatformSelector({ selectedPlatform, onSelectPlatform }: PlatformSelectorProps) {
  const platforms = [
    { id: "linkedin", name: "LinkedIn", iconPath: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" },
    { id: "quora", name: "Quora", iconPath: "M8.73 12.476c-.554-1.091-1.204-2.193-2.473-2.193-.242 0-.484.04-.707.142l-.43-.863c.525-.45 1.373-.808 2.464-.808 1.697 0 2.568.818 3.2 1.7.63-.071 1.232-.105 1.898-.105 2.022 0 3.334 1.2 3.334 3.016 0 1.568-.788 2.653-2.008 3.174.607.71 1.253 1.684 1.998 2.686h-1.234c-.8-1.293-1.544-2.389-2.494-3.273-1.054 1.008-2.459 1.445-4.218 1.445-1.939 0-3.791-.816-3.791-3.094 0-2.345 2.328-3.229 4.433-3.229.7 0 1.331.08 1.988.165zm-4.445 5.46c0 1.074.977 1.554 1.858 1.554.667 0 1.655-.17 2.297-.478.148-.38.291-.873.437-1.399-.379-.03-.769-.044-1.185-.044-1.179 0-3.407.15-3.407 1.376z" }
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Select Platform</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            variant={selectedPlatform === platform.id ? "default" : "outline"}
            className={cn(
              "flex items-center justify-center h-20 w-full sm:w-36 transition-all",
              selectedPlatform === platform.id && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => onSelectPlatform(platform.id as Platform)}
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                viewBox="0 0 16 16"
                className="h-6 w-6"
                fill="currentColor"
              >
                <path d={platform.iconPath} />
              </svg>
              <span>{platform.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

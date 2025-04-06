
import React from "react";
import { PlatformSelector } from "@/components/platforms/PlatformSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Webhook } from "lucide-react";
import { Platform } from "@/hooks/useContentStore";

interface PlatformSectionProps {
  platform: Platform | null;
  setPlatform: (platform: Platform) => void;
  useWebhook: boolean;
  setUseWebhook: (value: boolean) => void;
}

export function PlatformSection({ platform, setPlatform, useWebhook, setUseWebhook }: PlatformSectionProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-sm border border-blue-200">
        <PlatformSelector selectedPlatform={platform} onSelectPlatform={setPlatform} />
        
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="webhook-mode"
            checked={useWebhook}
            onCheckedChange={setUseWebhook}
          />
          <Label htmlFor="webhook-mode" className="text-sm font-medium">
            <div className="flex items-center">
              <Webhook className="w-4 h-4 mr-2" />
              Use webhook for content generation
            </div>
          </Label>
        </div>
      </div>
    </div>
  );
}

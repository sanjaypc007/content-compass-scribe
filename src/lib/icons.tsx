
import React from "react";
import { LinkedinIcon, MessageSquare } from "lucide-react";

export const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  return platform === "linkedin" ? (
    <LinkedinIcon className="h-4 w-4" />
  ) : (
    <MessageSquare className="h-4 w-4" />
  );
};

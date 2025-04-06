
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, History, Home } from "lucide-react";

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: Home
  },
  {
    title: "History",
    href: "/history",
    icon: History
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar
  }
];

export function Navbar() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-contentCompass-blue to-contentCompass-purple"></div>
            <span className="hidden font-bold sm:inline-block">
              ContentCompass
            </span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

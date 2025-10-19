import { RefreshCw, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  lastUpdate: number | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function DashboardHeader({ lastUpdate, onRefresh, isRefreshing }: DashboardHeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme as 'light' | 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <div className="w-6 h-6 bg-primary-foreground rounded-sm" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-title">
                Minetrack
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time Minecraft Server Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdate && (
              <Badge 
                variant="secondary" 
                className="hidden sm:flex items-center gap-2"
                data-testid="badge-lastupdate"
              >
                <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-primary animate-pulse' : 'bg-primary'}`} />
                Updated {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true })}
              </Badge>
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onRefresh}
              disabled={isRefreshing}
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

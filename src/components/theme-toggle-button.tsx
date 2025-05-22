
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "./ui/sidebar";


export function ThemeToggleButton() {
  const { setTheme, theme } = useTheme();
  const { state: sidebarState } = useSidebar(); // Use to show full text or just icon

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // If you want a dropdown for Light/Dark/System
  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger asChild>
  //       <Button variant="ghost" size={sidebarState === 'collapsed' ? 'icon' : 'default'} className="w-full justify-start">
  //         <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  //         <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  //         {sidebarState !== 'collapsed' && <span className="ml-2">Toggle theme</span>}
  //         <span className="sr-only">Toggle theme</span>
  //       </Button>
  //     </DropdownMenuTrigger>
  //     <DropdownMenuContent align="end">
  //       <DropdownMenuItem onClick={() => setTheme("light")}>
  //         Light
  //       </DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme("dark")}>
  //         Dark
  //       </DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme("system")}>
  //         System
  //       </DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // );

  // Simple toggle button
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size={sidebarState === 'collapsed' ? 'icon' : 'default'}
          className={sidebarState !== 'collapsed' ? "w-full justify-start px-2" : "h-8 w-8"}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {sidebarState !== 'collapsed' && <span className="ml-2">Toggle Theme</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={sidebarState !== 'collapsed'}>
        Toggle Theme ({theme === 'light' ? 'Dark' : 'Light'})
      </TooltipContent>
    </Tooltip>
  );
}

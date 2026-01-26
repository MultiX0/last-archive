"use client"

import Image from "next/image"
import { Menu, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3 pt-safe border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden text-foreground hover:bg-muted flex-shrink-0">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Image 
            src="/android-chrome-512x512.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8 rounded-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-sm md:text-base font-semibold tracking-tight truncate">The Last Archive</h1>
            <p className="text-xs text-muted-foreground hidden md:block truncate">Humanity's Final Repository</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 ml-2">
        <div className="hidden lg:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            <span className="font-medium text-secondary">PROTECTED</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Last Sync: 2026</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/30">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-medium text-secondary hidden sm:inline">ONLINE</span>
        </div>
      </div>
    </header>
  )
}

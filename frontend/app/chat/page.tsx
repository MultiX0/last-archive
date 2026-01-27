"use client"

import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh w-screen bg-background overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        }>
          <ChatInterface />
        </Suspense>
      </div>
    </div>
  )
}

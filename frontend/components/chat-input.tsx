"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void,
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleFocus = () => {
      setTimeout(() => {
        textarea.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 300);
    }

    textarea.addEventListener("focus", handleFocus);
    return () => textarea.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown as any);
    return () => window.removeEventListener("keydown", handleKeyDown as any);
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {

    const textarea = textareaRef.current;

    if (e.key === "Enter" && e.shiftKey) {
      if (document.activeElement !== textarea) {
        e.preventDefault();
        textarea?.focus();
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-2 md:p-4 pb-safe">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-sm hover:border-border transition-colors overflow-hidden">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ask about humanity's knowledge..."
            className="min-h-11 max-h-50 resize-none border-0 bg-transparent px-3 py-2.5 pr-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="absolute right-1.5 bottom-1.5 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:bg-muted transition-colors cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-center text-muted-foreground hidden md:block">
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-xs">Enter</kbd> to
          send or{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-xs">Shift+Enter</kbd> for
          new line
        </p>
      </div>
    </div>
  )
}

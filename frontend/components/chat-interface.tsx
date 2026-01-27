"use client"

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { MessageList } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";
import { SuggestedPrompts } from "@/components/suggested-prompts";
import { searchStream, type SourceItem, type SourcesPayload, getSession } from "@/lib/search-api";
import { useSearchParams, useRouter } from "next/navigation";

export interface Message {
  id: string,
  role: "user" | "assistant",
  content: string,
  sources?: SourceItem[],
  status?: string,
  isStreaming?: boolean,
  searchTimeMs?: number,
  totalTimeMs?: number,
  error?: string,
}



export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentSessionId = searchParams.get("id");
  const initialQuery = searchParams.get("q");
  const hasSearched = useRef(false);
  const isGeneratingRef = useRef(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current && messages.length > 0) {
        scrollToBottom();
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [messages.length]);

  useEffect(() => {
    if (currentSessionId) {
      if (!isGeneratingRef.current) {
        loadHistory(currentSessionId);
      }
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  const loadHistory = async (id: string) => {
    setIsLoadingHistory(true);
    const data = await getSession(id);
    if (data) {
      const historyMessages: Message[] = data.history.map((msg, idx) => ({
        id: `${id}-${idx}`,
        role: msg.role,
        content: msg.content,
        sources: msg.sources?.items,
        searchTimeMs: msg.sources?.searchTimeMs,
      }))
      setMessages(historyMessages);
    }
    setIsLoadingHistory(false);
  }

  // Handle Initial Search
  useEffect(() => {
    if (initialQuery && !hasSearched.current && !currentSessionId) {
      hasSearched.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, currentSessionId]);

  const handleSendMessage = async (content: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    isGeneratingRef.current = true;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage]);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      status: "Searching...",
      isStreaming: true,
    }

    setMessages((prev) => [...prev, aiMessage]);

    try {
      await searchStream(
        content,
        {
          onStatus: (status) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId ? { ...msg, status } : msg
              )
            );
          },
          onSession: (sessionId) => {
            if (!currentSessionId && sessionId) {
              router.replace(`/chat?id=${sessionId}`);
            }
          },
          onSources: (data: SourcesPayload) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, sources: data.items, searchTimeMs: data.searchTimeMs }
                  : msg
              )
            );
          },
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, content: msg.content + token, status: undefined }
                  : msg
              )
            );
          },
          onDone: (data) => {
            isGeneratingRef.current = false
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, isStreaming: false, totalTimeMs: data.totalTimeMs }
                  : msg
              )
            );
          },
          onError: (error) => {
            isGeneratingRef.current = false
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, isStreaming: false, error, status: undefined }
                  : msg
              )
            );
          },
        },
        currentSessionId || null,
        abortControllerRef.current.signal
      )
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      isGeneratingRef.current = false;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                isStreaming: false,
                error: err instanceof Error ? err.message : "Search failed",
                status: undefined,
              }
            : msg
        )
      );
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-2">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading history...</p>
              </div>
            ) : (
              <SuggestedPrompts onSelectPrompt={handleSendMessage} />
            )}
          </div>
        ) : (
          <>
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  )
}

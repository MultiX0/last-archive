"use client"
import { useState } from "react"
import { Bot, ExternalLink, FileText, Globe, AlertCircle, Clock, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SourceItem } from "@/lib/search-api"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./markdown-plugins/CodeBlock"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Separator } from "./ui/separator"

interface AiMessageProps {
  content: string
  sources?: SourceItem[]
  status?: string
  isStreaming?: boolean
  searchTimeMs?: number
  totalTimeMs?: number
  error?: string
}

export function AiMessage({
  content,
  sources,
  status,
  isStreaming,
  searchTimeMs,
  totalTimeMs,
  error,
}: AiMessageProps) {
  const [showSourcesMobile, setShowSourcesMobile] = useState(false)
  const showStatus = status && !content && !error
  const showContent = content || error

  return (
    <div className="flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
      <div className="w-7 h-7 rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 space-y-3 min-w-0">
        {/* Status indicator */}
        {showStatus && (
          <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="text-sm text-primary font-medium">{status}</p>
            </div>
          </div>
        )}

        {/* Sources */}
        {sources && sources.length > 0 && (
          <>
            {/* Desktop View: Inline (Original Style) */}
            <div className="hidden md:block rounded-lg border border-border/50 bg-card/20 backdrop-blur-sm p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Sources ({sources.length})
                </span>
                {searchTimeMs && (
                  <span className="text-xs text-muted-foreground">
                    · {(searchTimeMs / 1000).toFixed(2)}s
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {sources.slice(0, 5).map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded shrink-0",
                        source.type === "pdf"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                      )}
                    >
                      {source.type === "pdf" ? (
                        <FileText className="h-3.5 w-3.5" />
                      ) : (
                        <Globe className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span className="text-sm text-foreground/80 group-hover:text-foreground truncate flex-1">
                      {source.title || source.url}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {Math.round(source.score * 100)}%
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                ))}
                {sources.length > 5 && (
                  <p className="text-xs text-muted-foreground pl-2">
                    +{sources.length - 5} more sources
                  </p>
                )}
              </div>
            </div>

            {/* Mobile View: Toggle Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowSourcesMobile(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20 text-xs font-medium text-secondary hover:bg-secondary/20 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                View {sources.length} Sources
                <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-50" />
              </button>
            </div>

            {/* Mobile Popup Overlay */}
            {showSourcesMobile && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowSourcesMobile(false)}>
                <div 
                  className="w-full max-w-md bg-background border border-border rounded-t-xl sm:rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Sources</h3>
                    <button onClick={() => setShowSourcesMobile(false)} className="p-1 rounded-full hover:bg-muted">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    <SourcesList sources={sources} searchTimeMs={searchTimeMs} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Main content / error */}
        {showContent && (
          <div
            className={cn(
              "rounded-lg border backdrop-blur-sm p-4 markdown",
              error
                ? "border-destructive/50 bg-destructive/10"
                : "border-border/50 bg-card/20"
            )}
          >
            {error ? (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            ) : (
              <div className="text-foreground/90 leading-relaxed text-pretty whitespace-pre-wrap wrap-break-word prose prose-invert markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <CodeBlock className={className}>
                            {children}
                          </CodeBlock>
                        ) : (
                          <code className="bg-neutral-800 px-1 rounded">
                            {children}
                          </code>
                        );
                      },
                    }}
                >
                  {content}
                </ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Completion time */}
        {totalTimeMs && !isStreaming && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Completed in {(totalTimeMs / 1000).toFixed(2)}s</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SourcesList({ sources, searchTimeMs }: { sources: SourceItem[]; searchTimeMs?: number }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Sources ({sources.length})
        </span>
        {searchTimeMs && <span className="text-xs text-muted-foreground">· {(searchTimeMs / 1000).toFixed(2)}s</span>}
      </div>
      <div className="space-y-1.5">
        {sources.slice(0, 5).map((source, idx) => (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded shrink-0",
                source.type === "pdf" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400",
              )}
            >
              {source.type === "pdf" ? (
                <FileText className="h-3.5 w-3.5" />
              ) : (
                <Globe className="h-3.5 w-3.5" />
              )}
            </div>
            <span className="text-sm text-foreground/80 group-hover:text-foreground truncate flex-1">
              {source.title || source.url}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">{Math.round(source.score * 100)}%</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
        ))}
        {sources.length > 5 && (
          <p className="text-xs text-muted-foreground pl-2">+{sources.length - 5} more sources</p>
        )}
      </div>
    </>
  )
}

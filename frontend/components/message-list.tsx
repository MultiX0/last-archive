import type { Message } from "@/components/chat-interface"
import { UserMessage } from "@/components/user-message"
import { AiMessage } from "@/components/ai-message"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} content={message.content} />
        ) : (
          <AiMessage
            key={message.id}
            content={message.content}
            sources={message.sources}
            status={message.status}
            isStreaming={message.isStreaming}
            searchTimeMs={message.searchTimeMs}
            totalTimeMs={message.totalTimeMs}
            error={message.error}
          />
        ),
      )}
    </div>
  )
}

import { User } from "lucide-react"

interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 mt-1">
        <p className="text-muted-foreground leading-relaxed break-words">{content}</p>
      </div>
    </div>
  )
}

"use client"

import { Sparkles, History, Atom, Dna, Rocket, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const prompts = [
    {
      icon: History,
      title: "First Civilization",
      prompt: "What was the first human civilization and what did they achieve?",
    },
    {
      icon: Atom,
      title: "Quantum Physics",
      prompt: "Explain the discovery of the Higgs boson and its significance",
    },
    {
      icon: Dna,
      title: "Human Genome",
      prompt: "Tell me about the Human Genome Project and its impact",
    },
    {
      icon: Rocket,
      title: "Space Exploration",
      prompt: "Describe humanity's journey to explore space",
    },
    {
      icon: BookOpen,
      title: "Cultural Legacy",
      prompt: "What are the greatest works of human literature?",
    },
    {
      icon: Sparkles,
      title: "Last Discovery",
      prompt: "What was the last major scientific discovery before the archive was sealed?",
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Welcome to The Last Archive</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Explore the complete repository of humanity's knowledge, discoveries, and cultural heritage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((item, index) => {
          const Icon = item.icon
          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => onSelectPrompt(item.prompt)}
              className="h-auto p-4 flex items-start gap-3 text-left hover:bg-muted/50 hover:border-primary/30 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm mb-1 text-foreground">{item.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{item.prompt}</div>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

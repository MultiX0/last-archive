"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchStats, type StatsData } from "@/lib/search-api"

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoadingStats(true)
      const data = await fetchStats()
      setStats(data)
      setIsLoadingStats(false)
    }
    loadStats()
  }, [])

  const suggestedQueries = [
    "What was the last human transmission from Earth?",
    "Explain quantum entanglement",
    "History of human space exploration",
    "The Renaissance period",
    "Origins of human civilization",
    "Discovery of DNA structure",
  ]

  return (
    <div className="min-h-dvh bg-[#0A0A0A] text-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Image 
                src="/android-chrome-512x512.png" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-base font-medium">The Last Archive</span>
            </div>
            <Link href="/chat">
              <Button size="sm" className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white border-0 h-8 text-sm font-normal">
                Launch
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium mb-4 text-balance leading-tight">
              The Repository of All
              <br />
              Human Knowledge
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              An immutable archive preserving humanity's discoveries, cultural heritage, and collective wisdom.
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/chat?q=${encodeURIComponent(searchQuery)}`
                  }
                }}
                placeholder="Ask anything about human history, science, culture..."
                className="w-full h-14 pl-12 pr-32 rounded-xl bg-[#1A1A1A] border border-white/10 focus:border-[#60A5FA]/50 focus:outline-none focus:ring-1 focus:ring-[#60A5FA]/50 text-base placeholder:text-gray-500 transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Link href={searchQuery.trim() ? `/chat?q=${encodeURIComponent(searchQuery)}` : "/chat"}>
                  <Button
                    size="sm"
                    className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white border-0 h-10 px-6 text-sm font-normal"
                  >
                    Search
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Suggested Queries */}
          <div className="space-y-3">
            <p className="text-sm text-gray-500 px-1">Try asking:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQueries.map((query, index) => (
                <Link key={index} href={`/chat?q=${encodeURIComponent(query)}`}>
                  <button className="w-full text-left px-4 py-3 rounded-lg bg-[#1A1A1A] border border-white/10 hover:border-white/20 hover:bg-[#1F1F1F] transition-all text-sm text-gray-300 group">
                    <span className="group-hover:text-white transition-colors">{query}</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                {isLoadingStats ? (
                  <div className="flex items-center justify-center h-8 mb-1">
                    <Loader2 className="h-5 w-5 text-[#60A5FA] animate-spin" />
                  </div>
                ) : (
                  <div className="text-2xl font-medium text-[#60A5FA] mb-1">
                    {stats?.entries.value || "2.8M+"}
                  </div>
                )}
                <div className="text-xs text-gray-500">Entries</div>
              </div>
              <div>
                {isLoadingStats ? (
                  <div className="flex items-center justify-center h-8 mb-1">
                    <Loader2 className="h-5 w-5 text-[#60A5FA] animate-spin" />
                  </div>
                ) : (
                  <div className="text-2xl font-medium text-[#60A5FA] mb-1">
                    {stats?.pages.value || "1.5M+"}
                  </div>
                )}
                <div className="text-xs text-gray-500">Web Pages</div>
              </div>
              <div>
                {isLoadingStats ? (
                  <div className="flex items-center justify-center h-8 mb-1">
                    <Loader2 className="h-5 w-5 text-[#60A5FA] animate-spin" />
                  </div>
                ) : (
                  <div className="text-2xl font-medium text-[#60A5FA] mb-1">
                    {stats?.pdfs.value || "1.3M+"}
                  </div>
                )}
                <div className="text-xs text-gray-500">PDFs</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-[#60A5FA] mb-1">Unlimited</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">Preserving humanity's knowledge for eternity</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#60A5FA] animate-pulse" />
              <span className="text-xs text-gray-500">Archive Status: Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

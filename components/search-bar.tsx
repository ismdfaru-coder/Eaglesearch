"use client"

import { Search, ArrowRight } from "lucide-react"
import { useState } from "react"

export function SearchBar() {
  const [query, setQuery] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    // Placeholder: wire up to a real search backend later.
    console.log("[v0] search submitted:", query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-full border border-border bg-input px-5 py-3.5 shadow-lg transition-colors focus-within:border-ring">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web with an eagle's eye..."
          aria-label="Search"
          className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}

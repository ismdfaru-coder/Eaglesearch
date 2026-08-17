"use client"

import { useState } from "react"
import { Search, ArrowRight } from "lucide-react"

const suggestions = ["latest tech news", "how to brew pour-over coffee", "hiking trails near me", "next.js caching"]

export function SearchHero() {
  const [query, setQuery] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    console.log("[v0] search submitted:", query)
  }

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <form onSubmit={handleSubmit} className="w-full" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search the web
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 shadow-sm transition-shadow focus-within:border-accent focus-within:shadow-md">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
            }}
            placeholder="Search the web..."
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-opacity hover:opacity-90"
            aria-label="Search"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQuery(s)}
            className="rounded-full border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

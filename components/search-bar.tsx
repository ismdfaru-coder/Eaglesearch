"use client"

import { Search, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"

interface SearchResult {
  id: string
  title: string
  url: string
  description: string
  content?: string
  publishedDate?: string | null
  favicon?: string | null
  language?: string
  score?: number
}

interface SearchMetadata {
  searchTime: number
  sources: string[]
  relatedQueries: string[]
  knowledgeGraph: any | null
}

interface SearchResponse {
  query: string
  results: SearchResult[]
  totalResults: number
  page: number
  limit: number
  hasMore: boolean
  metadata: SearchMetadata
  error?: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchMetadata, setSearchMetadata] = useState<SearchMetadata | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setResults([])
    setSearchMetadata(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          limit: 10,
          offset: 0
        }),
      })

      const data: SearchResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch search results")
      }

      setResults(data.results)
      setSearchMetadata(data.metadata)
      console.log("[Eaglesearch] Search completed:", data)
      
      // Scroll to results section if exists
      const resultsSection = document.getElementById("search-results")
      if (resultsSection && data.results.length > 0) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      console.error("[Eaglesearch] Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 rounded-full border border-border bg-input px-5 py-3.5 shadow-lg transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web with an eagle's eye..."
            aria-label="Search"
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <button
            type="submit"
            aria-label="Submit search"
            disabled={isLoading || !query.trim()}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Search failed</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 && searchMetadata && (
        <div id="search-results" className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Found {searchMetadata.searchTime < 1000 ? `${Math.round(searchMetadata.searchTime)}ms` : `${(searchMetadata.searchTime / 1000).toFixed(1)}s`} • {results.length} results</span>
          </div>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <article
                key={result.id || index}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {result.favicon && (
                    <img
                      src={result.favicon}
                      alt=""
                      className="mt-0.5 size-5 shrink-0 rounded"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link"
                    >
                      <h3 className="text-lg font-medium text-primary transition-colors group-hover/link:underline line-clamp-2">
                        {result.title}
                      </h3>
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {result.url}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground line-clamp-3">
                      {result.description}
                    </p>
                    {result.publishedDate && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(result.publishedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {result.score !== undefined && result.score > 0 && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {(result.score * 100).toFixed(0)}% match
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Related Queries */}
          {searchMetadata.relatedQueries && searchMetadata.relatedQueries.length > 0 && (
            <div className="mt-6 rounded-lg border border-border bg-card p-4">
              <h4 className="text-sm font-medium text-foreground">Related searches</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {searchMetadata.relatedQueries.map((relatedQuery, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(relatedQuery)
                      // Auto-submit could be added here
                    }}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {relatedQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div id="search-results" className="mt-8 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span>Searching the web...</span>
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start gap-3">
                <div className="size-5 shrink-0 rounded bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-5/6 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

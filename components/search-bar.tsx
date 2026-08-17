"use client"

import { Search, ArrowRight, Loader2, Sparkles, ExternalLink, FileText } from "lucide-react"
import { useState } from "react"

const CERAMIC_API_KEY = "cer_sk_live_e10ef1122740_eyJvcmdfaWQiOiJvcmdfMDFNMDhIWkY5OUdHS1hQVEFZWDlRWUQ1RFIiLCJrZXlfaWQiOiJlMTBlZjExMjI3NDAifQ.mNxnpUpYfW-FNvHhLRU-m0VZcY7lWGeXW8nr_EbcCEM"
// Using a common endpoint pattern - adjust if Ceramic has specific docs
const CERAMIC_API_BASE = "https://api.ceramic.network"

interface SearchResult {
  id: string
  title: string
  content: string
  url?: string
  score?: number
}

interface SearchResponse {
  answer?: string
  results: SearchResult[]
  query: string
  total?: number
  sources?: Array<{ title: string; url: string }>
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<Array<{ title: string; url: string }>>([])

  async function performSearch(searchQuery: string) {
    setIsLoading(true)
    setError(null)
    setResults([])
    setAiAnswer(null)
    setSources([])

    try {
      // Brave Search AI style: Combine semantic search with AI synthesis
      // Step 1: Try to get documents/context from Ceramic
      const searchEndpoint = `${CERAMIC_API_BASE}/api/v0/search`
      
      const searchResponse = await fetch(searchEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CERAMIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 10,
          include_metadata: true,
          model: "docs", // Target documentation specifically
        }),
      })

      let searchResults: SearchResult[] = []
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        searchResults = (searchData.results || []).map((item: any, index: number) => ({
          id: item.id || `result-${index}`,
          title: item.metadata?.title || item.title || "Document",
          content: item.content || item.text || item.snippet || "",
          url: item.metadata?.url || item.url || "#",
          score: item.score,
        }))
      }

      // Step 2: Send query + context to AI for synthesis (Brave AI Answer style)
      const aiEndpoint = `${CERAMIC_API_BASE}/api/v0/chat/completions`
      
      const contextText = searchResults.length > 0 
        ? searchResults.map(r => `Title: ${r.title}\nContent: ${r.content}`).join("\n\n")
        : "No specific documents found."

      const aiResponse = await fetch(aiEndpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CERAMIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "ceramic-ai", // or appropriate model name
          messages: [
            {
              role: "system",
              content: `You are an AI search assistant. Based on the following documentation context, provide a clear, concise answer to the user's question. 
              
Format your response like Brave Search AI:
1. Start with a direct answer (2-3 sentences)
2. Use bullet points for key details if applicable
3. Keep it factual and cite the context provided

Context:
${contextText}`
            },
            {
              role: "user",
              content: searchQuery
            }
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      })

      let aiAnswerText = ""
      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        aiAnswerText = aiData.choices?.[0]?.message?.content || ""
      }

      // If we got search results but no AI answer, generate a fallback summary
      if (!aiAnswerText && searchResults.length > 0) {
        aiAnswerText = `Based on ${searchResults.length} relevant document(s) found:\n\n` + 
          searchResults.slice(0, 3).map(r => `• **${r.title}**: ${r.content.substring(0, 150)}...`).join("\n")
      }

      setResults(searchResults)
      setAiAnswer(aiAnswerText || "No relevant information found in the documentation.")
      setSources(searchResults.map(r => ({ title: r.title, url: r.url || "#" })))
      
    } catch (err) {
      console.error("Search failed:", err)
      setError(err instanceof Error ? err.message : "An error occurred while searching. Please check your API key and network connection.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    performSearch(query.trim())
  }

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-full border border-border bg-input px-5 py-3.5 shadow-lg transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything... (Brave Search AI style)"
          aria-label="Search"
          className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Submit search"
          disabled={isLoading || !query.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5" aria-hidden="true" />
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-medium">Search Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center space-y-3 py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Searching documentation and generating AI answer...</p>
        </div>
      )}

      {!isLoading && aiAnswer && (
        <div className="mt-8 space-y-6">
          {/* AI Answer Section - Like Brave's AI Summary */}
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <h2 className="text-lg font-semibold text-primary">AI Answer</h2>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{aiAnswer}</p>
            </div>
            {sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-primary/10">
                <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {sources.slice(0, 4).map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <FileText className="size-3" />
                      {source.title.length > 40 ? source.title.substring(0, 40) + "..." : source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Traditional Search Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Relevant Documents ({results.length})
              </h3>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary group-hover:underline line-clamp-1">
                        {result.title}
                      </h4>
                      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {result.content}
                      </p>
                      {result.url && result.url !== "#" && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {result.url}
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { NextRequest, NextResponse } from "next/server"

const CERAMIC_API_KEY = "cer_sk_live_e10ef1122740_eyJvcmdfaWQiOiJvcmdfMDFNMDhIWkY5OUdHS1hQVEFZWDlRWUQ1RFIiLCJrZXlfaWQiOiJlMTBlZjExMjI3NDAifQ.mNxnpUpYfW-FNvHhLRU-m0VZcY7lWGeXW8nr_EbcCEM"
const CERAMIC_API_URL = "https://api.ceramic.ai/search"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, limit = 10, offset = 0 } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required and must be a string" },
        { status: 400 }
      )
    }

    // Build the request to Ceramic AI API
    const ceramicRequest = await fetch(CERAMIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CERAMIC_API_KEY}`,
        "User-Agent": "Eaglesearch/1.0"
      },
      body: JSON.stringify({
        query: query
      })
    })

    if (!ceramicRequest.ok) {
      const errorText = await ceramicRequest.text()
      console.error("Ceramic API error:", errorText)
      
      if (ceramicRequest.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key or authentication failed" },
          { status: 401 }
        )
      }
      
      if (ceramicRequest.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: "Failed to fetch search results from Ceramic AI" },
        { status: ceramicRequest.status }
      )
    }

    const data = await ceramicRequest.json()

    // Transform Ceramic AI response to our format
    // Note: Ceramic returns results nested under result.results
    const rawResults = data.result?.results || data.results || []
    const results = rawResults.map((result: any, index: number) => ({
      id: result.id || `result-${index}`,
      title: result.title || "Untitled",
      url: result.url || "",
      description: result.description || result.snippet || "",
      content: result.content || "",
      publishedDate: result.published_date || null,
      favicon: result.favicon || null,
      language: result.language || "en",
      score: result.score || 0
    }))

    // Return comprehensive response with all features
    return NextResponse.json({
      query: data.query || query,
      results: results,
      totalResults: data.result?.totalResults || data.total_results || results.length,
      page: Math.floor(offset / limit) + 1,
      limit: limit,
      hasMore: (offset + limit) < (data.result?.totalResults || data.total_results || results.length),
      metadata: {
        searchTime: data.result?.searchMetadata?.executionTime ? data.result.searchMetadata.executionTime * 1000 : (data.search_time || 0),
        sources: data.sources || [],
        relatedQueries: data.related_queries || [],
        knowledgeGraph: data.knowledge_graph || null
      }
    })

  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Internal server error while processing search request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const limit = parseInt(searchParams.get("limit") || "10")
  const offset = parseInt(searchParams.get("offset") || "0")

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    )
  }

  // Forward to POST handler logic
  const mockRequest = new NextRequest(request.nextUrl, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ query, limit, offset })
  })

  return POST(mockRequest)
}

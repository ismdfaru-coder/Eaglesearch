import { SearchHero } from "@/components/search-hero"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="font-mono text-sm text-muted-foreground">eaglesearch</span>
        <nav aria-label="Main">
          <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            About
          </a>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-24">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Eagle<span className="text-accent">search</span>
          </h1>
          <p className="text-muted-foreground text-pretty">Sharp-eyed search. Find anything, fast.</p>
        </div>
        <SearchHero />
      </main>

      <footer className="flex items-center justify-center px-6 py-4">
        <p className="text-xs text-muted-foreground">Eaglesearch &mdash; every result in sight</p>
      </footer>
    </div>
  )
}

import { Bird, Zap, ShieldCheck, Telescope } from "lucide-react"
import { SearchBar } from "@/components/search-bar"

const features = [
  {
    icon: Zap,
    title: "Blazing fast",
    description: "Results in milliseconds so you never lose your train of thought.",
  },
  {
    icon: Telescope,
    title: "Eagle-eye ranking",
    description: "Sharp relevance that surfaces the signal and skips the noise.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "No tracking, no profiles. Your searches stay yours.",
  },
]

const suggestions = ["Latest in AI", "Best hiking trails", "How to fold origami", "Space telescopes"]

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bird className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Eaglesearch</span>
        </div>
        <nav className="flex items-center gap-2">
          <a
            href="#"
            className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </a>
          <a
            href="#"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get started
          </a>
        </nav>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Bird className="size-9" aria-hidden="true" />
        </span>
        <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          See further. Search sharper.
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Eaglesearch gives you fast, focused answers with an eagle-eye view of the entire web.
        </p>

        <div className="mt-10 flex w-full flex-col items-center">
          <SearchBar />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-4xl gap-4 px-6 pb-20 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-6 text-left">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-medium">{f.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </section>
    </main>
  )
}

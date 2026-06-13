import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, CheckCircle2 } from "lucide-react"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer"

type LegalSection = {
  id: string
  title: string
  content: ReactNode
}

type LegalDocumentPageProps = {
  title: string
  accentTitle?: string
  description: string
  lastUpdated: string
  effectiveDate: string
  sections: LegalSection[]
}

export default function LegalDocumentPage({
  title,
  accentTitle,
  description,
  lastUpdated,
  effectiveDate,
  sections,
}: LegalDocumentPageProps) {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-mint-green) 0%, var(--color-snow-white) 30%, var(--color-snow-white) 70%, var(--color-mint-green) 100%)",
        }}
      >
        <div className="relative overflow-hidden">
          <div className="relative container mx-auto px-4 pb-8 pt-24">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-soft-blue transition-colors hover:text-soft-coral"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-balance text-4xl font-bold text-soft-coral md:text-5xl">
                {title}
                {accentTitle ? <span className="block text-3xl text-soft-blue md:text-4xl">{accentTitle}</span> : null}
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-xl leading-relaxed text-cool-gray">{description}</p>
              <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-soft-blue/15 bg-snow-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-soft-blue">
                    <CalendarDays className="h-4 w-4" />
                    Last Updated
                  </div>
                  <p className="mt-2 text-lg font-bold text-dark-slate-gray">{lastUpdated}</p>
                </div>
                <div className="rounded-lg border border-soft-blue/15 bg-snow-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-soft-blue">
                    <CheckCircle2 className="h-4 w-4" />
                    Effective From
                  </div>
                  <p className="mt-2 text-lg font-bold text-dark-slate-gray">{effectiveDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-lg border border-border/50 bg-snow-white p-5 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-cool-gray">On this page</p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-md px-3 py-2 text-sm text-cool-gray transition-colors hover:bg-soft-blue/10 hover:text-soft-blue"
                  >
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="space-y-5">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-lg border border-border/50 bg-snow-white p-6 shadow-sm"
              >
                <h2 className="mb-4 text-2xl font-bold text-dark-slate-gray">{section.title}</h2>
                <div className="space-y-4 text-[15px] leading-7 text-cool-gray">{section.content}</div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-lg font-semibold text-dark-slate-gray">{children}</h3>
}

export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-soft-coral/25 bg-soft-coral/5 p-4 text-sm leading-6 text-dark-slate-gray">
      {children}
    </div>
  )
}

export function LegalTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50 bg-white">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-soft-blue/10 text-dark-slate-gray">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-border/50 px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.join("-")} className={index % 2 === 0 ? "bg-white" : "bg-snow-white"}>
              {row.map((cell) => (
                <td key={cell} className="border-b border-border/40 px-4 py-3 align-top text-cool-gray">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

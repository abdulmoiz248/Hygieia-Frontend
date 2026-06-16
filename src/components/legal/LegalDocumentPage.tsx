import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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
  scrollableToc?: boolean
}

export default function LegalDocumentPage({
  title,
  accentTitle,
  description,
  lastUpdated,
  effectiveDate,
  sections,
  scrollableToc = false,
}: LegalDocumentPageProps) {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-mint-green) 0%, var(--color-snow-white) 28%, var(--color-snow-white) 100%)",
        }}
      >
        <div className="container mx-auto max-w-7xl px-4 pb-16 pt-24">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-soft-blue transition-colors hover:text-soft-coral"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="rounded-lg border border-soft-blue/10 bg-snow-white/95 shadow-lg shadow-soft-blue/5">
            <header className="border-b border-soft-blue/10 px-6 py-9 text-center md:px-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-soft-blue">Hygieia Healthcare Platform</p>
              <h1 className="mx-auto mt-3 text-balance text-4xl font-bold text-soft-coral md:text-5xl">
                {title}
                {accentTitle ? <span className="block text-3xl text-soft-blue md:text-4xl">{accentTitle}</span> : null}
              </h1>
              <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-cool-gray">{description}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-cool-gray">
                <span>
                  <strong className="text-dark-slate-gray">Last Updated:</strong> {lastUpdated}
                </span>
                <span>
                  <strong className="text-dark-slate-gray">Effective From:</strong> {effectiveDate}
                </span>
              </div>
            </header>

            <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
              <aside
                className={`hidden self-start border-r border-soft-blue/10 bg-mint-green/10 lg:sticky lg:top-20 lg:block ${
                  scrollableToc ? "lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto" : ""
                }`}
              >
                <div className="px-6 pb-6 pt-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-soft-blue">On this page</p>
                  <nav className="space-y-1 pb-1">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block rounded-md px-3 py-2 text-sm text-cool-gray transition-colors hover:bg-snow-white hover:text-soft-blue"
                      >
                        {section.title.replace(/^\d+\.\s*/, "")}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              <article className="px-6 py-8 md:px-10">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 border-b border-soft-blue/10 py-8 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <h2 className="mb-4 text-2xl font-bold text-dark-slate-gray">
                      <span className="text-soft-blue">{section.title.split(".")[0]}.</span>
                      {section.title.includes(".") ? section.title.slice(section.title.indexOf(".") + 1) : section.title}
                    </h2>
                    <div className="space-y-4 text-[15px] leading-7 text-cool-gray">{section.content}</div>
                  </section>
                ))}
              </article>
            </div>
          </div>
        </div>
      </main>
      <Footer waveFill="fill-snow-white" />
    </>
  )
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-lg font-semibold text-soft-blue">{children}</h3>
}

export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-soft-coral/25 bg-gradient-to-r from-soft-coral/10 to-mint-green/10 p-4 text-sm leading-6 text-dark-slate-gray">
      {children}
    </div>
  )
}

export function LegalTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-hidden rounded-lg border border-soft-blue/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-gradient-to-r from-soft-blue/10 to-mint-green/20 text-dark-slate-gray">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-soft-blue/10 px-5 py-4 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.join("-")} className="bg-white transition-colors hover:bg-mint-green/5">
              {row.map((cell) => (
                <td
                  key={cell}
                  className={`border-b border-soft-blue/5 px-5 py-4 align-top leading-6 text-cool-gray ${
                    index === rows.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

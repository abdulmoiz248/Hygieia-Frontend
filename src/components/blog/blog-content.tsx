import type { BlogPost } from "@/types/blog"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, User } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"
import { normalizeEscapedText, renderBlogContent } from "@/lib/blog-markdown"

interface BlogContentProps {
  post: BlogPost
}

export function BlogContent({ post }: BlogContentProps) {
  const renderedContent = useMemo(() => {
    const content = removeLeadingDuplicateTitle(post.content, post.title)
    if (!content) return ""
    return renderBlogContent(content)
  }, [post.content, post.title])

  const excerpt = normalizeEscapedText(post.excerpt)

  return (
    <article className="relative">
      {/* Featured Image */}
      <div className="relative overflow-hidden aspect-[21/9] md:aspect-[21/8]">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="px-6 sm:px-8 md:px-12 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Badge variant="outline" className="text-soft-blue bg-soft-blue/10 border-soft-blue/30 px-3 py-1 text-sm font-semibold">
              {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
            {post.featured && (
              <Badge className="bg-soft-coral text-snow-white border-soft-coral px-3 py-1 text-sm font-semibold">
                Featured
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-slate-gray mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-8 mb-8 border-b border-soft-blue/10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soft-blue to-mint-green flex items-center justify-center">
                <User className="w-5 h-5 text-snow-white" />
              </div>
              <div>
                <p className="font-semibold text-dark-slate-gray text-sm">{post.author}</p>
                <p className="text-xs text-cool-gray">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-cool-gray">
              <Calendar className="w-4 h-4 text-soft-blue" />
              <time dateTime={post.publishedat} className="text-sm">
                {new Date(post.publishedat).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>

            <div className="flex items-center gap-2 text-cool-gray">
              <Clock className="w-4 h-4 text-mint-green" />
              <span className="text-sm font-medium">{post.readTime} min read</span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-10 p-6 bg-gradient-to-br from-mint-green/10 to-soft-blue/10 rounded-2xl border-l-4 border-soft-blue">
            <p className="text-lg md:text-xl text-dark-slate-gray leading-relaxed font-medium italic whitespace-pre-line">
              {excerpt}
            </p>
          </div>

          {/* Content */}
          <div className="max-w-none">
            <div
              className="
                text-base md:text-lg leading-relaxed text-cool-gray
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-5 [&_h1]:text-dark-slate-gray
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-9 [&_h2]:mb-4 [&_h2]:text-dark-slate-gray
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-dark-slate-gray
                [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-dark-slate-gray
                [&_p]:mb-6 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
                [&_li]:leading-relaxed
                [&_strong]:font-semibold [&_strong]:text-dark-slate-gray
                [&_em]:italic
                [&_code]:bg-soft-blue/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-soft-blue [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-dark-slate-gray [&_pre]:text-snow-white [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_pre]:text-sm
                [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
                [&_blockquote]:border-l-4 [&_blockquote]:border-soft-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-dark-slate-gray [&_blockquote]:mb-6
                [&_a]:text-soft-blue [&_a]:underline [&_a]:underline-offset-2
                [&_hr]:border-soft-blue/20 [&_hr]:my-8
              "
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </div>

          {/* Tags */}
          <footer className="mt-16 pt-8 border-t border-soft-blue/20">
            <h3 className="text-sm font-semibold text-cool-gray uppercase tracking-wider mb-4">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gradient-to-r from-mint-green/20 to-soft-blue/20 text-dark-slate-gray hover:from-mint-green/30 hover:to-soft-blue/30 border border-soft-blue/20 px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </article>
  )
}

function removeLeadingDuplicateTitle(content: string, title: string): string {
  const normalized = normalizeEscapedText(content).trimStart()
  const lines = normalized.split("\n")
  const firstMeaningfulLineIndex = lines.findIndex((line) => line.trim())

  if (firstMeaningfulLineIndex === -1) return ""

  const firstLine = lines[firstMeaningfulLineIndex]
    .replace(/^#{1,6}\s+/, "")
    .replace(/<[^>]+>/g, "")
    .trim()

  if (firstLine.toLowerCase() !== title.trim().toLowerCase()) {
    return normalized
  }

  return lines.slice(firstMeaningfulLineIndex + 1).join("\n").trimStart()
}

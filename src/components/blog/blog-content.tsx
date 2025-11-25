import type { BlogPost } from "@/types/blog"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, User } from "lucide-react"
import Image from "next/image"

interface BlogContentProps {
  post: BlogPost
}

export function BlogContent({ post }: BlogContentProps) {
  return (
    <article className="relative">
      {/* Featured Image - Full Bleed */}
      <div className="relative overflow-hidden aspect-[21/9] md:aspect-[21/8]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-slate-gray/60 z-10" />
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-snow-white bg-soft-blue/90 backdrop-blur-sm border-soft-blue/50 px-3 py-1 text-sm font-semibold">
                {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
              {post.featured && (
                <Badge className="bg-soft-coral/90 backdrop-blur-sm text-snow-white border-soft-coral/50 px-3 py-1 text-sm font-semibold">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-snow-white mb-4 leading-tight drop-shadow-2xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-6 sm:px-8 md:px-12 py-10">
        <div className="max-w-4xl mx-auto">
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
            <p className="text-lg md:text-xl text-dark-slate-gray leading-relaxed font-medium italic">
              {post.excerpt}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-cool-gray leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  let content = post.content

                  // Bold first
                  content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-dark-slate-gray">$1</strong>')

                  // Headings
                  content = content
                    .replace(/^# (.*)$/gm, '<h1 class="text-4xl font-bold text-dark-slate-gray mb-6 mt-12 pb-3 border-b-2 border-soft-blue/20">$1</h1>')
                    .replace(/^## (.*)$/gm, '<h2 class="text-3xl font-bold text-dark-slate-gray mb-5 mt-10">$1</h2>')
                    .replace(/^### (.*)$/gm, '<h3 class="text-2xl font-semibold text-dark-slate-gray mb-4 mt-8">$1</h3>')

                  // Bullet list
                  const lines = content.split('\n')
                  let inList = false
                  const resultLines: string[] = []

                  lines.forEach((line) => {
                    if (/^- /.test(line)) {
                      if (!inList) {
                        inList = true
                        resultLines.push('<ul class="ml-6 space-y-2 mb-6 list-none">')
                      }
                      resultLines.push(`<li class="flex items-start gap-3 text-cool-gray"><span class="inline-block w-2 h-2 rounded-full bg-soft-blue mt-2 flex-shrink-0"></span><span>${line.replace(/^- /, '')}</span></li>`)
                    } else {
                      if (inList) {
                        inList = false
                        resultLines.push('</ul>')
                      }
                      if (line.trim() !== '') {
                        resultLines.push(`<p class="mb-6 text-base leading-relaxed">${line}</p>`)
                      }
                    }
                  })

                  if (inList) resultLines.push('</ul>')

                  return resultLines.join('\n')
                })(),
              }}
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

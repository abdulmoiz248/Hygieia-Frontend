import type { BlogPost } from "@/types/blog"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
import Image from "next/image"

interface BlogContentProps {
  post: BlogPost
}

export function BlogContent({ post }: BlogContentProps) {
  

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className='text-white bg-black'>
            {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
          {post.featured && <Badge className="bg-soft-coral text-snow-white">Featured</Badge>}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-dark-slate-gray mb-6 leading-tight">{post.title}</h1>

        <p className="text-xl text-cool-gray mb-8 leading-relaxed">{post.excerpt}</p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <p className="font-medium text-dark-slate-gray">{post.author.name}</p>
              <p className="text-xs">{post.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-lg mb-8">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div
          className="text-cool-gray leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post.content
              .replace(/^# /gm, '<h1 class="text-3xl font-bold text-dark-slate-gray mb-6 mt-8">')
              .replace(/^## /gm, '<h2 class="text-2xl font-bold text-dark-slate-gray mb-4 mt-8">')
              .replace(/^### /gm, '<h3 class="text-xl font-semibold text-dark-slate-gray mb-3 mt-6">')
              .replace(/^- /gm, '<li class="mb-2">')
              .replace(/^\* /gm, '<li class="mb-2">')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-dark-slate-gray">$1</strong>')
              .replace(/\n\n/g, '</p><p class="mb-4">')
              .replace(/^(?!<[h|l])/gm, '<p class="mb-4">'),
          }}
        />
      </div>

      {/* Tags */}
      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      </footer>
    </article>
  )
}

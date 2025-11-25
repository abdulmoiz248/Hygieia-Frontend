import { Metadata } from "next"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  try {
    // Fetch blog post data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return {
        title: 'Blog Post | Hygieia',
        description: 'Read our latest healthcare articles and insights.',
      }
    }

    const post = await response.json()

    return {
      title: `${post.title} | Hygieia Blog`,
      description: post.excerpt,
      keywords: post.tags.join(', '),
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishedat,
        authors: [post.author],
        tags: post.tags,
        images: [
          {
            url: post.image || '/placeholder.svg',
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.image || '/placeholder.svg'],
        creator: `@${post.author.replace(/\s+/g, '')}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog Post | Hygieia',
      description: 'Read our latest healthcare articles and insights.',
    }
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

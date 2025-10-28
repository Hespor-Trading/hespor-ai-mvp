import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MDXContent } from "@/components/mdx-content"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} - Hespor AI`,
    description: post.description,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <article className="py-12">
        <div className="container">
          <Link href="/resources">
            <Button variant="ghost" size="sm" className="mb-8 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Button>
          </Link>

          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {post.category}
              </div>
              <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
              <p className="mb-6 text-pretty text-xl text-muted-foreground leading-relaxed">{post.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <MDXContent content={post.content} />
            </div>
          </div>
        </div>
      </article>

      {/* Related CTA */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight">Ready to Optimize Your Amazon PPC?</h2>
            <p className="mb-6 text-muted-foreground">
              Start your free trial and see how Hespor AI can transform your campaigns.
            </p>
            <Link href="/auth/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

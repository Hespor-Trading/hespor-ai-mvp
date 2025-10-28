import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllPosts } from "@/lib/blog"
import { ArrowRight, Calendar, Clock } from "lucide-react"

export default function ResourcesPage() {
  const posts = getAllPosts()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Resources & Insights</h1>
            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              Learn Amazon PPC strategies, optimization tips, and industry insights from our team of experts.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24">
        <div className="container">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-muted-foreground">No blog posts yet. Check back soon for insights and updates!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.slug} className="flex flex-col border-border/50 transition-all hover:border-primary/50">
                  <CardHeader>
                    <div className="mb-2 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {post.category}
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      <Link href={`/resources/${post.slug}`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <Link
                      href={`/resources/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight">Want to Learn More?</h2>
            <p className="mb-6 text-muted-foreground">
              Subscribe to our newsletter for the latest Amazon PPC tips and strategies.
            </p>
            <Link href="/contact">
              <Button>Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

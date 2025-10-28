export function MDXContent({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-pre:bg-muted prose-pre:p-4 prose-ul:list-disc prose-ol:list-decimal">
      {content.split("\n").map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className="mb-4 mt-8">
              {line.replace("# ", "")}
            </h1>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="mb-3 mt-6">
              {line.replace("## ", "")}
            </h2>
          )
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="mb-2 mt-4">
              {line.replace("### ", "")}
            </h3>
          )
        }
        if (line.trim() === "") {
          return <br key={i} />
        }
        return (
          <p key={i} className="mb-4">
            {line}
          </p>
        )
      })}
    </div>
  )
}

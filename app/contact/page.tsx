"use client"

import type React from "react"

import { SiteShell } from "@/components/site-shell"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock, HelpCircle, Shield, FileText } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("Thank you! We'll get back to you soon.")
    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <SiteShell>
      <main className="py-20">
        <div className="mx-auto max-w-[1000px] px-6">
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">Contact Us</h1>
          <p className="mb-12 text-xl leading-relaxed text-muted-foreground">
            Have questions? We're here to help. Reach out to our support team.
          </p>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={6}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)]"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[var(--brand-green)]" />
                  <h3 className="text-lg font-semibold text-foreground">Phone Support</h3>
                </div>
                <p className="text-muted-foreground">
                  <a href="tel:+16042628066" className="hover:text-[var(--brand-green)] hover:underline">
                    +1 (604) 262 8066
                  </a>
                </p>
              </div>

              <div className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[var(--brand-green)]" />
                  <h3 className="text-lg font-semibold text-foreground">Email</h3>
                </div>
                <p className="text-muted-foreground">
                  <a href="mailto:info@hespor.com" className="hover:text-[var(--brand-green)] hover:underline">
                    info@hespor.com
                  </a>
                </p>
              </div>

              <div className="rounded-lg border border-border/40 bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--brand-green)]" />
                  <h3 className="text-lg font-semibold text-foreground">Business Hours</h3>
                </div>
                <p className="text-muted-foreground">Monday – Friday</p>
                <p className="text-muted-foreground">9:00 AM – 6:00 PM (PST)</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--brand-green)] hover:underline"
                  >
                    <HelpCircle className="h-4 w-4" />
                    FAQ
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--brand-green)] hover:underline"
                  >
                    <Shield className="h-4 w-4" />
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--brand-green)] hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SiteShell>
  )
}

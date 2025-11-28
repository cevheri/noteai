"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  Lock,
  Folder,
  Star,
  Code,
  Zap,
  ArrowRight,
  Check,
  ChevronRight,
  Menu,
  X,
  Github,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(!!data.user);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Writing",
      description:
        "Get intelligent suggestions, improve your writing, and generate content with our built-in AI assistant.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Code,
      title: "Code Formatting",
      description:
        "Beautiful syntax highlighting for code snippets. Format, explain, and debug code with AI help.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Folder,
      title: "Smart Organization",
      description:
        "Categories, tags, and favorites keep your notes organized. Find anything instantly with powerful search.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your notes are protected with secure authentication. Your data stays yours.",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant sync, responsive interface, and optimized performance for a seamless experience.",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: Star,
      title: "Rich Markdown",
      description:
        "Full markdown support with live preview. Write beautiful, formatted notes effortlessly.",
      color: "from-pink-500 to-rose-600",
    },
  ];

  const testimonials = [
    {
      quote:
        "NotesAI has completely transformed how I take notes. The AI suggestions are incredibly helpful!",
      author: "Sarah Chen",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    {
      quote:
        "The code formatting feature is a game-changer for my technical documentation.",
      author: "Mike Williams",
      role: "Tech Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      quote:
        "Finally, a note app that understands what I need. The organization features are perfect.",
      author: "Emily Parker",
      role: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">NotesAI</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="block text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <div className="pt-3 flex flex-col gap-2">
                {isLoggedIn ? (
                  <Button onClick={() => router.push("/dashboard")}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Get Started Free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Note Taking
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Your thoughts, amplified
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              by AI intelligence
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            NotesAI combines the simplicity of a modern note app with powerful AI
            assistance. Write better, organize smarter, and capture ideas faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Button size="lg" onClick={() => router.push("/dashboard")}>
                Open Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/register">
                    Start Writing for Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">
                    Try Demo Account
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border shadow-2xl overflow-hidden bg-card">
              <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  NotesAI Dashboard
                </span>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                <div className="grid grid-cols-12 gap-4 p-6 w-full h-full">
                  {/* Sidebar mockup */}
                  <div className="col-span-3 bg-card rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-primary" />
                      <div className="h-4 w-16 bg-foreground/20 rounded" />
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-muted" />
                        <div className="h-3 flex-1 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                  {/* Notes list mockup */}
                  <div className="col-span-3 bg-card rounded-lg border p-4 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${
                          i === 1 ? "bg-accent" : "bg-muted/50"
                        }`}
                      >
                        <div className="h-4 w-3/4 bg-foreground/20 rounded mb-2" />
                        <div className="h-3 w-full bg-muted rounded mb-1" />
                        <div className="h-3 w-2/3 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                  {/* Editor mockup */}
                  <div className="col-span-6 bg-card rounded-lg border p-4">
                    <div className="flex items-center gap-2 pb-3 border-b mb-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-6 h-6 rounded bg-muted" />
                      ))}
                      <div className="ml-auto px-3 py-1.5 rounded bg-gradient-to-r from-violet-600 to-indigo-600">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-white" />
                          <span className="text-xs text-white">AI</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-6 w-1/2 bg-foreground/20 rounded mb-4" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-3 bg-muted rounded"
                          style={{ width: `${Math.random() * 40 + 60}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to capture ideas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you write, organize, and create
              better than ever before.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-card rounded-xl border hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Assistant
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Write smarter with AI assistance
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our integrated AI assistant helps you write better content, fix
                grammar, generate ideas, and even debug code. It&apos;s like having a
                writing partner available 24/7.
              </p>
              <ul className="space-y-4">
                {[
                  "Improve writing clarity and flow",
                  "Generate summaries and expand ideas",
                  "Fix grammar and spelling errors",
                  "Format and explain code snippets",
                  "Create task lists from notes",
                  "Brainstorm new ideas",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-xl border shadow-xl overflow-hidden bg-card">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span className="text-sm font-medium">AI Assistant</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      Selected Text:
                    </p>
                    <p className="text-sm">
                      The quick brown fox jumps over the lazy dog...
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Improve", "Summarize", "Expand", "Simplify"].map(
                      (action) => (
                        <Button
                          key={action}
                          variant="outline"
                          size="sm"
                          className="justify-start"
                        >
                          <Sparkles className="w-3 h-3 mr-2" />
                          {action}
                        </Button>
                      )
                    )}
                  </div>
                  <div className="p-4 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-lg border border-violet-500/20">
                    <p className="text-sm font-medium mb-2">AI Result:</p>
                    <p className="text-sm text-muted-foreground">
                      The agile auburn fox gracefully leaps across the
                      resting canine, demonstrating remarkable speed and
                      dexterity...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by writers and developers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about their experience with NotesAI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl border"
              >
                <p className="text-muted-foreground mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start for free, upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-6 bg-card rounded-xl border">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">
                Perfect for getting started
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Up to 50 notes",
                  "Basic AI assistance",
                  "5 categories",
                  "Markdown support",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 bg-card rounded-xl border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">
                For power users
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Unlimited notes",
                  "Advanced AI features",
                  "Unlimited categories",
                  "Priority support",
                  "Export options",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
            </div>

            {/* Team Plan */}
            <div className="p-6 bg-card rounded-xl border">
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <p className="text-muted-foreground mb-4">
                For collaborative teams
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/user/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Everything in Pro",
                  "Team collaboration",
                  "Shared workspaces",
                  "Admin controls",
                  "API access",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to transform your note-taking?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of users who write smarter with NotesAI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
            >
              <Link href="/register">
                Get Started for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/login">Try Demo Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-semibold">NotesAI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NotesAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import Link from "next/link";
import { FileText, ArrowLeft, Check, Sparkles, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingTable } from "@/components/autumn/pricing-table";
import { AutumnProvider } from "autumn-js/react";
import { useSession } from "@/lib/auth-client";

const productDetails = [
  {
    id: "free",
    description: "Perfect for getting started with note-taking",
    items: [
      { primaryText: "Up to 10 notes" },
      { primaryText: "20 AI requests/month" },
      { primaryText: "Basic markdown editing" },
    ],
  },
  {
    id: "pro",
    description: "For power users who need more",
    recommendText: "Most Popular",
    price: {
      primaryText: "$9/month",
      secondaryText: "billed monthly",
    },
    items: [
      { primaryText: "Unlimited notes" },
      { primaryText: "200 AI requests/month" },
      { primaryText: "Priority support" },
      { primaryText: "Advanced formatting" },
    ],
  },
  {
    id: "team",
    description: "Best for teams and collaboration",
    price: {
      primaryText: "$19/month",
      secondaryText: "billed monthly",
    },
    items: [
      { primaryText: "Unlimited notes" },
      { primaryText: "Unlimited AI requests" },
      { primaryText: "Priority support" },
      { primaryText: "Team collaboration" },
      { primaryText: "Shared workspaces" },
    ],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <AutumnProvider
      apiKey={process.env.NEXT_PUBLIC_AUTUMN_PUBLISHABLE_KEY}
      customerId={session?.user?.id}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-semibold text-lg">NotesAI</span>
            </Link>
            <div className="flex items-center gap-4">
              {session?.user ? (
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          {/* Back link */}
          <Link
            href={session?.user ? "/dashboard" : "/"}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock the full potential of AI-powered note-taking. Start free
              and upgrade as you grow.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="max-w-5xl mx-auto mb-16">
            <PricingTable productDetails={productDetails} />
          </div>

          {/* Features Comparison */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Why Choose NotesAI?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg bg-card border">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Get intelligent writing suggestions and content improvements
                  powered by advanced AI.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card border">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Built for speed with instant search, quick editing, and
                  real-time sync.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg bg-card border">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Team Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Collaborate with your team seamlessly with shared workspaces
                  and real-time editing.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-card border">
                <h3 className="font-semibold mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes
                  take effect immediately and we'll prorate the difference.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <h3 className="font-semibold mb-2">
                  What happens when I hit my AI request limit?
                </h3>
                <p className="text-sm text-muted-foreground">
                  You'll be prompted to upgrade your plan. Your notes remain
                  accessible, but AI features will be limited until the next
                  billing cycle or plan upgrade.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card border">
                <h3 className="font-semibold mb-2">
                  Is there a free trial for paid plans?
                </h3>
                <p className="text-sm text-muted-foreground">
                  The Free plan lets you try all core features. When you're ready
                  to unlock more, simply upgrade - no commitment required.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2024 NotesAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AutumnProvider>
  );
}

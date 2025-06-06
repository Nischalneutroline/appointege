// app/page.tsx
import { auth, signOut } from "@/auth";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Page() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
              Appointege
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-slate-600 hover:text-sky-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-slate-600 hover:text-sky-500 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-slate-600 hover:text-sky-500 transition-colors"
            >
              About
            </Link>
            {session?.user ? (
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button
                  variant="ghost"
                  className="text-slate-600 hover:bg-slate-100"
                >
                  Sign Out
                </Button>
              </form>
            ) : (
              <LoginButton asChild>
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                  Sign In
                </Button>
              </LoginButton>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-72 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Modern Appointment <br />
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Scheduling Software
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Streamline your booking process, reduce no-shows, and grow your
            business with our powerful scheduling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LoginButton asChild>
              <Button
                size="lg"
                className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-lg font-semibold"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </LoginButton>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-slate-300"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-slate-600 text-lg">
              Powerful features designed to help you manage appointments
              efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-sky-500" />,
                title: "Smart Scheduling",
                description:
                  "Let clients book appointments 24/7 through your personalized booking page.",
              },
              {
                icon: <Clock className="w-8 h-8 text-sky-500" />,
                title: "Automated Reminders",
                description:
                  "Reduce no-shows with automated email and SMS reminders.",
              },
              {
                icon: <Users className="w-8 h-8 text-sky-500" />,
                title: "Client Management",
                description:
                  "Keep all client information organized in one place.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100"
              >
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your scheduling?
          </h2>
          <p className="text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses that trust Appointege for their
            scheduling needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LoginButton asChild>
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-slate-100 px-8 py-6 text-lg font-semibold"
              >
                Start Free Trial
              </Button>
            </LoginButton>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section> */}
    </div>
  );
}

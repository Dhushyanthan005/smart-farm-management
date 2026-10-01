import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Activity, Milk } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] flex flex-col justify-between">
      <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-[#1E3A2F] flex items-center justify-center text-white font-bold text-lg">
            DF
          </div>
          <div>
            <span className="font-bold text-xl text-[#1F2421]">DairyFlow</span>
            <span className="block text-xs text-gray-500 font-medium">Smart Dairy OS</span>
          </div>
        </div>

        <div className="space-x-3">
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Launch Console</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE5] text-[#1E3A2F] text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" />
          Enterprise Farm Architecture Ready
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-[#1F2421] tracking-tight leading-tight">
          Precision Dairy Farming, <br />
          <span className="text-[#1E3A2F]">Intelligently Orchestrated.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl leading-relaxed">
          DairyFlow unifies livestock lifecycle tracking, veterinary health, milk yield logging,
          feed formulation, and direct-to-consumer logistics into a high-performance modular monolith.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-base">
              Enter Operations Console
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/cows">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
              View Herd Management
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left w-full">
          <div className="p-6 bg-white rounded-lg border border-[#E2E5DF] shadow-card">
            <div className="w-10 h-10 rounded-md bg-[#E8EFE5] text-[#1E3A2F] flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#1F2421]">Herd Health & Lineage</h3>
            <p className="text-sm text-gray-500 mt-2">
              Track vaccinations, veterinary treatments, heat cycles, and genetic lineage with zero guesswork.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-[#E2E5DF] shadow-card">
            <div className="w-10 h-10 rounded-md bg-[#E8EFE5] text-[#1E3A2F] flex items-center justify-center mb-4">
              <Milk className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#1F2421]">Milk Production & QA</h3>
            <p className="text-sm text-gray-500 mt-2">
              Record morning and evening yields, fat/SNF metrics, and bulk refrigeration tank utilization.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-[#E2E5DF] shadow-card">
            <div className="w-10 h-10 rounded-md bg-[#E8EFE5] text-[#1E3A2F] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#1F2421]">Logistics & Subscriptions</h3>
            <p className="text-sm text-gray-500 mt-2">
              Manage daily recurring milk delivery routes, instant pauses, customer billing, and driver dropoffs.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-[#E2E5DF] text-center text-xs text-gray-500">
        © 2026 DairyFlow Systems. Production-Ready Modular Monolith Architecture.
      </footer>
    </div>
  );
}

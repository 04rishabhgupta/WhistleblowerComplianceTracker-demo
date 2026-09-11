"use client";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export function LargeNameFooter() {
  return (
    <footer className="py-12 px-4 md:px-6 bg-black border-t border-slate-900 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="mb-8 lg:mb-0 lg:w-1/3">
            <Link href="/" className="flex items-center gap-2 text-white">
              <ShieldAlert className="w-8 h-8 text-teal-500" />
              <h2 className="text-xl font-bold tracking-tight">TARI WB</h2>
            </Link>

            <h1 className="text-slate-400 mt-4 text-sm leading-relaxed max-w-sm">
              Enterprise-grade whistleblower management and compliance platform. Built for trust and security.
            </h1>
            <div className="mt-6">
              <Link href="https://x.com/compose/tweet?text=Secure%20your%20compliance%20workflow%20with%20%23TARIWB">
                <Button variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700 border-none">
                  Share Your Thoughts On
                  <Icons.twitter className="ml-2 w-4 h-4 text-sky-400" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-500 mt-8">
              © {new Date().getFullYear()} Thought Arbitrage Consulting. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:w-2/3">
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Security Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full flex mt-16 items-center justify-center pointer-events-none">
          <h1 className="text-center text-4xl md:text-7xl lg:text-[12rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-800 to-black select-none tracking-tighter">
            TARI WB
          </h1>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowRight, Lock, Inbox, Users, Activity, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function RoleSelector() {
  const { users, setActiveUser } = useAppStore();

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-sans overflow-y-auto overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <ShieldAlert className="h-8 w-8 text-teal-400" />
          <span className="text-xl font-bold tracking-tight">TARI Ethics</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <Button onClick={scrollToDemo} className="bg-teal-600 hover:bg-teal-500 text-white border-none rounded-full px-6">
            Try Demo
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 px-6 lg:px-12 bg-[#1e1b4b] overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <Badge className="bg-white/10 text-teal-300 border-teal-500/30 mb-6 px-4 py-1 text-sm font-medium rounded-full backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 mr-2 inline-block" />
            SOC2 Type II Certified Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Enterprise-grade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-300">
              Whistleblower Management.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl font-light leading-relaxed">
            Secure, anonymous, and compliant incident reporting built for modern organizations. Streamline intake, automate triage, and protect your most valuable asset: your integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button onClick={scrollToDemo} size="lg" className="bg-teal-600 hover:bg-teal-500 text-white rounded-full h-14 px-8 text-base">
              Experience the Platform <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white rounded-full h-14 px-8 text-base backdrop-blur-sm">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 px-6 lg:px-12 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive Compliance Workflows</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Everything your ethics team needs to intake, investigate, and resolve cases seamlessly.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Inbox className="w-8 h-8 text-teal-600" />}
              title="Automated Intake"
              description="Instantly convert emails and hotline calls into structured cases ready for triage."
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-teal-600" />}
              title="Secure Correspondence"
              description="Communicate with anonymous reporters via a secure, encrypted two-way channel."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-teal-600" />}
              title="Role-Based Access"
              description="Strictly scope case access to assigned investigators and compliance officers."
            />
            <FeatureCard 
              icon={<Activity className="w-8 h-8 text-teal-600" />}
              title="Immutable Audit Trail"
              description="Every action, view, and modification is logged permanently for compliance audits."
            />
          </div>
        </div>
      </section>

      {/* Demo Persona Selector */}
      <section id="demo-section" className="py-24 px-6 lg:px-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Interactive Demo Environment</h2>
            <p className="text-slate-500 max-w-2xl text-lg">
              To explore the platform, select a persona below. This determines your permissions, dashboard view, and available actions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {users.map((user) => (
              <div 
                key={user.id}
                onClick={() => setActiveUser(user.id)}
                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-teal-500" />
                </div>
                <Avatar className="h-20 w-20 mb-5 border-4 border-slate-50 group-hover:border-teal-50 transition-colors">
                  <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
                <Badge className="mt-3 mb-2 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-3 py-1 font-medium">{user.role}</Badge>
                {user.department && <span className="text-sm text-slate-500 font-medium">{user.department}</span>}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center text-sm text-slate-400">
            <p>Note: This is a frontend UI demo. All data is stored in memory and resets upon page refresh.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center border-t border-slate-800">
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
          <ShieldAlert className="h-6 w-6 text-slate-500" />
          <span className="text-lg font-bold tracking-tight">TARI Ethics</span>
        </div>
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Thought Arbitrage Consulting. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

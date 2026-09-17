'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowRight, Lock, Inbox, Users, Activity, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'motion/react';
import GlobeDemo from '@/components/ui/globe-demo';
import { FeaturesCarouselDemo } from '@/components/FeaturesCarouselDemo';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { LargeNameFooter } from '@/components/ui/large-name-footer';
import { useRouter } from 'next/navigation';

export function RoleSelector() {
  const { users, setActiveUser } = useAppStore();
  const router = useRouter();

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="dark flex min-h-screen w-full flex-col bg-black text-foreground font-sans overflow-y-auto overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <ShieldAlert className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          <span className="text-xl font-bold tracking-tight">TARI WB</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700 dark:text-white/80">
          <a href="#features" className="hover:text-teal-600 dark:hover:text-white transition-colors">Features</a>
          <a href="#security" className="hover:text-teal-600 dark:hover:text-white transition-colors">Security</a>
          <Button onClick={scrollToDemo} className="bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white border-none rounded-full px-6">
            Try Demo
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <AuroraBackground className="w-full h-[100vh] lg:h-[80vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center px-6 text-center mt-20"
        >
          <Badge className="bg-slate-900/5 text-slate-800 dark:text-teal-300 border-slate-900/10 dark:border-teal-500/30 mb-6 px-4 py-1 text-sm font-bold rounded-full backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 mr-2 inline-block" />
            SOC2 Type II Certified Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black dark:text-white tracking-tight leading-[1.1] mb-8">
            Enterprise-grade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-500 dark:from-teal-400 dark:to-indigo-300">
              Whistleblower Management.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-indigo-100/80 mb-10 max-w-2xl font-light leading-relaxed">
            Secure, anonymous, and compliant incident reporting built for modern organizations. Streamline intake, automate triage, and protect your most valuable asset: your integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button onClick={scrollToDemo} size="lg" className="bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full h-14 px-8 text-base">
              Experience the Platform <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-slate-300 dark:border-white/20 bg-white/50 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full h-14 px-8 text-base backdrop-blur-sm">
              View Documentation
            </Button>
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Features Section */}
      <section id="features" className="py-12 bg-black relative">
        <FeaturesCarouselDemo />
      </section>

      {/* Global Section */}
      <GlobeDemo />

      {/* Demo Persona Selector */}
      <section id="demo-section" className="py-24 px-6 lg:px-12 bg-black border-t border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Interactive Demo Login</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Select a persona below to authenticate into the platform. These mock credentials give you instant access to different compliance workflows.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {users.map((user) => (
              <div key={user.id} onClick={() => { setActiveUser(user.id); router.push('/dashboard'); }} className="cursor-pointer">
                <CardSpotlight className="h-full w-full flex flex-col items-center justify-center p-8 text-center group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <ArrowRight className="w-5 h-5 text-teal-400" />
                  </div>
                  <Avatar className="h-20 w-20 mb-5 border-4 border-slate-800 group-hover:border-teal-500 transition-colors relative z-20">
                    <AvatarFallback className="bg-slate-900 text-white text-2xl font-bold">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-xl text-white relative z-20">{user.name}</h3>
                  <p className="text-sm text-teal-400 font-mono mt-1 relative z-20">{user.email}</p>
                  <Badge className="mt-4 mb-3 bg-white/10 text-slate-200 hover:bg-white/20 border-none px-4 py-1.5 font-medium relative z-20 text-sm">
                    {user.role} Access
                  </Badge>
                  {user.department && <span className="text-sm text-slate-400 font-medium relative z-20">{user.department}</span>}

                  <div className="w-full mt-6 pt-6 border-t border-white/10 text-left relative z-20">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Permissions Include</p>
                    <ul className="text-sm text-slate-300 space-y-2">
                      {user.role === 'SysAdmin' ? (
                        <>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Platform Configuration</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> User & Role Management</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Audit Log Access</li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Anonymous Communication</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Investigation Workspaces</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Reporting Analytics</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardSpotlight>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-slate-500">
            <p>Note: This is a frontend UI demo. All authentication state is stored in memory and resets upon page refresh.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LargeNameFooter />
    </div>
  );
}


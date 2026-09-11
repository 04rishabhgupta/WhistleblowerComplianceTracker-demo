import Image from "next/image";
import { FloatingCard } from "@/components/ui/floating-card";
import {
  ShieldCheck,
  Inbox,
  MessageSquare,
  FileText,
  Users,
  BarChart,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeaturesGridDemo() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <FloatingCard 
          key={i} 
          className={cn(
            "w-full h-full min-h-[24rem]",
            (i === 3 || i === 6) ? "lg:col-span-2" : ""
          )}
        >
          <div className="group flex flex-col justify-between space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6 h-full shadow-lg transition-colors hover:border-teal-500/50">
            <div className="flex flex-1 w-full h-48 rounded-xl overflow-hidden relative border border-slate-800 mb-4">
              <Image 
                src={item.src} 
                alt={item.title} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            <div className="flex-none">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-slate-800 rounded-lg">
                  {item.icon}
                </div>
                <div className="font-bold text-lg text-slate-100">
                  {item.title}
                </div>
              </div>
              <div className="text-sm font-normal text-slate-400">
                {item.description}
              </div>
            </div>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
}

const items = [
  {
    title: "Secure Incident Intake",
    description: "Omnichannel case intake spanning email, web portals, and hotlines with end-to-end encryption.",
    src: "/images/bento/secure_intake.jpg",
    icon: <Inbox className="h-5 w-5 text-teal-400" />,
  },
  {
    title: "Automated Case Triage",
    description: "Intelligent routing and risk assessment to assign cases to the right compliance officers.",
    src: "/images/bento/automated_triage.jpg",
    icon: <Activity className="h-5 w-5 text-indigo-400" />,
  },
  {
    title: "Anonymous Correspondence",
    description: "Secure, two-way encrypted communication channels with anonymous whistleblowers.",
    src: "/images/bento/anonymous_messaging.jpg",
    icon: <MessageSquare className="h-5 w-5 text-blue-400" />,
  },
  {
    title: "Comprehensive Investigation",
    description:
      "Collaborative workspaces for investigators to document evidence, record interviews, and track findings to resolution.",
    src: "/images/bento/investigation.jpg",
    icon: <FileText className="h-5 w-5 text-slate-300" />,
  },
  {
    title: "Role-Based Access Control",
    description: "Granular permission models ensuring strict confidentiality and 'need-to-know' case access.",
    src: "/images/bento/rbac.jpg",
    icon: <Users className="h-5 w-5 text-purple-400" />,
  },
  {
    title: "Real-time Analytics",
    description: "Interactive dashboards tracking SLAs, case volumes, and key compliance metrics.",
    src: "/images/bento/analytics.jpg",
    icon: <BarChart className="h-5 w-5 text-emerald-400" />,
  },
  {
    title: "Immutable Audit Trail",
    description: "Tamper-proof logging of every action, view, and modification for strict regulatory and SOC2 compliance.",
    src: "/images/bento/audit_trail.jpg",
    icon: <ShieldCheck className="h-5 w-5 text-rose-400" />,
  },
];

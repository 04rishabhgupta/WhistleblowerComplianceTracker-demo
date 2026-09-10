import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  ShieldCheck,
  Inbox,
  MessageSquare,
  FileText,
  Users,
  BarChart,
  Activity
} from "lucide-react";

export default function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br ${className || 'from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100'}`}></div>
);

const items = [
  {
    title: "Secure Incident Intake",
    description: "Omnichannel case intake spanning email, web portals, and hotlines with end-to-end encryption.",
    header: <Skeleton className="from-teal-100 to-teal-50 dark:from-teal-900/40 dark:to-teal-800/20" />,
    icon: <Inbox className="h-4 w-4 text-teal-600" />,
  },
  {
    title: "Automated Case Triage",
    description: "Intelligent routing and risk assessment to assign cases to the right compliance officers.",
    header: <Skeleton className="from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-800/20" />,
    icon: <Activity className="h-4 w-4 text-indigo-600" />,
  },
  {
    title: "Anonymous Correspondence",
    description: "Secure, two-way encrypted communication channels with anonymous whistleblowers.",
    header: <Skeleton className="from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20" />,
    icon: <MessageSquare className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "Comprehensive Investigation",
    description:
      "Collaborative workspaces for investigators to document evidence, record interviews, and track findings to resolution.",
    header: <Skeleton className="from-slate-200 to-slate-100 dark:from-slate-800/60 dark:to-slate-900/40" />,
    icon: <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />,
  },
  {
    title: "Role-Based Access Control",
    description: "Granular permission models ensuring strict confidentiality and 'need-to-know' case access.",
    header: <Skeleton className="from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20" />,
    icon: <Users className="h-4 w-4 text-purple-600" />,
  },
  {
    title: "Real-time Analytics",
    description: "Interactive dashboards tracking SLAs, case volumes, and key compliance metrics.",
    header: <Skeleton className="from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20" />,
    icon: <BarChart className="h-4 w-4 text-emerald-600" />,
  },
  {
    title: "Immutable Audit Trail",
    description: "Tamper-proof logging of every action, view, and modification for strict regulatory and SOC2 compliance.",
    header: <Skeleton className="from-rose-100 to-rose-50 dark:from-rose-900/40 dark:to-rose-800/20" />,
    icon: <ShieldCheck className="h-4 w-4 text-rose-600" />,
  },
];

import Image from "next/image";
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

const ImageHeader = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] sm:min-h-[10rem] rounded-xl overflow-hidden relative group-hover/bento:shadow-md transition-shadow">
    <Image 
      src={src} 
      alt={alt} 
      fill 
      className="object-cover transition-transform duration-500 group-hover/bento:scale-105"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);

const items = [
  {
    title: "Secure Incident Intake",
    description: "Omnichannel case intake spanning email, web portals, and hotlines with end-to-end encryption.",
    header: <ImageHeader src="/images/bento/secure_intake.jpg" alt="Secure Incident Intake" />,
    icon: <Inbox className="h-4 w-4 text-teal-600" />,
  },
  {
    title: "Automated Case Triage",
    description: "Intelligent routing and risk assessment to assign cases to the right compliance officers.",
    header: <ImageHeader src="/images/bento/automated_triage.jpg" alt="Automated Case Triage" />,
    icon: <Activity className="h-4 w-4 text-indigo-600" />,
  },
  {
    title: "Anonymous Correspondence",
    description: "Secure, two-way encrypted communication channels with anonymous whistleblowers.",
    header: <ImageHeader src="/images/bento/anonymous_messaging.jpg" alt="Anonymous Correspondence" />,
    icon: <MessageSquare className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "Comprehensive Investigation",
    description:
      "Collaborative workspaces for investigators to document evidence, record interviews, and track findings to resolution.",
    header: <ImageHeader src="/images/bento/investigation.jpg" alt="Comprehensive Investigation" />,
    icon: <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />,
  },
  {
    title: "Role-Based Access Control",
    description: "Granular permission models ensuring strict confidentiality and 'need-to-know' case access.",
    header: <ImageHeader src="/images/bento/rbac.jpg" alt="Role-Based Access Control" />,
    icon: <Users className="h-4 w-4 text-purple-600" />,
  },
  {
    title: "Real-time Analytics",
    description: "Interactive dashboards tracking SLAs, case volumes, and key compliance metrics.",
    header: <ImageHeader src="/images/bento/analytics.jpg" alt="Real-time Analytics" />,
    icon: <BarChart className="h-4 w-4 text-emerald-600" />,
  },
  {
    title: "Immutable Audit Trail",
    description: "Tamper-proof logging of every action, view, and modification for strict regulatory and SOC2 compliance.",
    header: <ImageHeader src="/images/bento/audit_trail.jpg" alt="Immutable Audit Trail" />,
    icon: <ShieldCheck className="h-4 w-4 text-rose-600" />,
  },
];

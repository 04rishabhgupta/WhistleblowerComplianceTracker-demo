import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function FeaturesCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-200 font-sans">
        Discover the capabilities.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({ text }: { text: string }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        {text}
      </p>
    </div>
  );
};

const data = [
  {
    category: "Core Feature",
    title: "Secure Intake Channels",
    src: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: (
      <DummyContent text="Omnichannel case intake spanning email, web portals, and hotlines with end-to-end encryption. Rest assured that all whistleblower data remains highly secure and inaccessible to unauthorized parties." />
    ),
  },
  {
    category: "Workflows",
    title: "Automated Case Triage",
    src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: (
      <DummyContent text="Intelligent routing and risk assessment to assign cases to the right compliance officers instantly. Define SLA policies and ensure that high-risk cases are escalated automatically." />
    ),
  },
  {
    category: "Communication",
    title: "Anonymous Correspondence",
    src: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: (
      <DummyContent text="Secure, two-way encrypted communication channels to maintain strict whistleblower anonymity. Interact safely without revealing IP addresses, identity, or metadata." />
    ),
  },
  {
    category: "Compliance",
    title: "Immutable Audit Trails",
    src: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: (
      <DummyContent text="Tamper-proof logging of every action, view, and modification for strict regulatory and SOC2 compliance. Generate one-click compliance reports for auditors." />
    ),
  },
  {
    category: "Reporting",
    title: "Real-time Analytics",
    src: "https://images.pexels.com/photos/5980888/pexels-photo-5980888.jpeg?auto=compress&cs=tinysrgb&w=800",
    content: (
      <DummyContent text="Interactive dashboards tracking SLAs, case volumes, and key compliance metrics. Spot trends and resolve systemic issues before they escalate." />
    ),
  },
];

import * as React from "react";

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="px-[4%] py-[3%] bg-zinc-900 rounded-[35px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-start gap-2.5">
      <div className="w-[12%] aspect-square p-3.5 bg-pink-600/10 rounded-[20px] inline-flex justify-center items-center gap-2.5">
        <Icon className="w-auto h-auto max-w-full max-h-full text-pink-600" />
      </div>
      <h2 className="text-center justify-start text-neutral-50 text-5xl font-bold">{title}</h2>
      <div className="justify-start text-neutral-50/40 text-lg font-bold -mt-2">{description}</div>
    </div>
  );
}


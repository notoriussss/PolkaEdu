import EducationIcon from "@/src/components/icons/education";
import GithubIcon from "@/src/components/icons/github";
import XtwitterIcon from "@/src/components/icons/xtwitter";
import MailIcon from "@/src/components/icons/mail";

interface FooterProps {
  backgroundColor?: '950' | '900';
}

export default function Footer({ backgroundColor = '950' }: FooterProps) {
  const bgClass = backgroundColor === '950' ? 'bg-neutral-950' : 'bg-neutral-900';

  return (
    <div className={`w-full min-h-[200px] mt-12 px-4 py-8 ${bgClass} flex justify-between items-center`}>
      <div className="flex justify-start items-center gap-60">
        <div className="w-[40%] flex flex-col justify-start items-start gap-2">
          <div className="inline-flex justify-start items-center gap-2">
            <EducationIcon className="w-20 h-20 text-pink-600 ml-5"/> 
            <h1 className="justify-start"><span className="text-neutral-50 text-5xl font-bold">Polka</span><span className="text-pink-600 text-5xl font-bold">Edu</span></h1>
          </div>
          <div className="w-full text-neutral-50/40 text-sm font-bold ml-5">Open-source educational platform built on Polkadot.</div>
          <div className="w-full text-neutral-50/40 text-sm font-bold whitespace-nowrap ml-5">© 2025 Polkadot Hackathon</div>
        </div>
        <div className="w-44 inline-flex flex-col justify-start items-start gap-3">
          <h1 className="self-stretch justify-start text-neutral-50 text-4xl font-bold">Links</h1>
          <div className="self-stretch justify-start text-neutral-50/40 text-sm font-bold">About</div>
          <div className="self-stretch justify-start text-neutral-50/40 text-sm font-bold">Partnerships</div>
        </div>
      </div>
      <div className="w-[13%] inline-flex flex-col justify-start items-center mr-5">
        <h1 className="text-center justify-start text-neutral-50 text-4xl font-bold">Social:</h1>
        <div className="self-stretch inline-flex justify-start items-center gap-4">
          <GithubIcon className="w-12 h-12"></GithubIcon>
          <XtwitterIcon className="w-8 h-8"></XtwitterIcon>
          <MailIcon className="w-12 h-12"></MailIcon>
        </div>
      </div>
    </div>
  );
}


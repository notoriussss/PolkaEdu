
import EducationIcon from "@/src/components/icons/education";
import ProposeIcon from "@/src/components/icons/propose";
import CourseIcon from "@/src/components/icons/course";
import VoteIcon from "@/src/components/icons/vote";
import ProcessStepCard from "@/src/components/ui/ProcessStepCard";
import Link from "next/link";

export default function Teach() {
  return (
    <div className="min-h-screen">
      <div className="w-full flex flex-col justify-start items-center gap-8 md:gap-12 pt-6 pb-0">
        {/* Titulo */}
        <div className="w-full flex flex-col justify-start items-start px-[2%]">
          <h1 className="text-center flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap text-neutral-50 text-5xl font-bold">
            <span style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>Share Your Knowledge on </span>
            <EducationIcon className="w-20 h-20 ml-1 text-pink-600 shrink-0" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))' }} />
            <span style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>Polka<span className="text-pink-600" style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>Edu</span></span>
            <span style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}>!</span>
          </h1>
          <div className="self-stretch justify-start text-neutral-50/40 text-2xl font-bold">Become an instructor and be rewarded by the community.</div>
        </div>

        {/* Dominio */}
        <div className="w-[95%] px-8 py-[2%] bg-neutral-800 rounded-3xl outline-2 -outline-offset- outline-pink-600 flex flex-col justify-center items-start gap-3">
          <h1 className="justify-start text-neutral-50 text-xl font-bold">Do you master 
            <span className="text-pink-600"> Rust</span>,
            <span className="text-pink-600"> Substrate</span>, or the latest
            <span className="text-pink-600"> Parachains</span>? The Polkadot ecosystem needs you!
          </h1>
          <div className="w-full justify-start text-neutral-50/40 text-base font-bold -mt-2">At PolkaEdu, each course is a value proposal reviewed and approved by our DAO community. This ensures quality and relevance of content.</div>
        </div>

        {/* Proceso Descentralizado */}
        <div className="w-[95%] flex flex-col justify-start items-center gap-7">
          <h1 className="self-stretch text-center text-neutral-50 text-3xl font-bold">Our Decentralized Process:</h1>
          <div className="w-full flex flex-col md:flex-row gap-6">
            <ProcessStepCard
              icon={ProposeIcon}
              title="1. Create the Proposal"
              description="Submit your course details (content, structure and requested reward) to the Governance system."
              className="w-full md:w-1/3"
            />
            <ProcessStepCard
              icon={VoteIcon}
              title="2. DAO Voting"
              description="The token holder community reviews your proposal and votes to decide whether to approve the course inclusion."
              className="w-full md:w-1/3"
            />
            <ProcessStepCard
              icon={CourseIcon}
              title="3. Upload Course and Claim Reward"
              description="Once approved, you upload the final content. It is published on PolkaEdu and your reward is released from the Treasury."
              className="w-full md:w-1/3"
            />
          </div>
        </div>

        {/* Listo para empezar? */}
        <div className="w-[95%] px-[27%] py-7 bg-neutral-800 rounded-3xl flex flex-col justify-start items-center gap-6">
          <h1 className="justify-start text-neutral-50 text-3xl font-bold">Ready to get started?</h1>
          <div className="justify-start text-neutral-50/40 text-lg leading-6 font-bold text-center -mt-4">All content proposals start in the Governance module.</div>
          <Link href="/governance" className="px-5 py-3.5 bg-pink-800 rounded-2xl inline-flex justify-center items-center gap-2.5 -mt-4 hover:bg-pink-700 transition-colors cursor-pointer">
            <h2 className="text-center justify-start text-neutral-50 text-lg font-bold">Submit My Course Proposal</h2>
          </Link>
        </div>

     
      </div>
    </div>
  );
}

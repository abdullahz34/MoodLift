import Link from "next/link";

export default function SurveyNavbar() {
  return (
    <nav className="bg-neutral-content px-8 py-3">
      <div className="flex items-center">
        <Link className="btn btn-ghost text-lg text-bg-secondary font-bold mr-3" href={"/surveys"}>
          Dashboard
        </Link>
        <Link className="btn btn-ghost text-lg text-bg-secondary font-bold mr-3" href={"/addSurvey"}>
          Create Survey
        </Link>
        
        <Link className="btn btn-ghost text-lg text-bg-secondary font-bold mr-3" href={"/infographics"}>
          Infographics
        </Link>
      </div>
    </nav>
  );
}

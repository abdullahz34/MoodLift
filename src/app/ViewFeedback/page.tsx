import GetFeedback from "./GetFeedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div>
      <div className="card w-200 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title bg-neutral-content">Viewing feedback</h2>
          <GetFeedback />
        </div>
      </div>
    </div>
  );
}
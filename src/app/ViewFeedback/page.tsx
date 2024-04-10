import GetFeedback from "./GetFeedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4">Viewing Feedback</h2>
      <GetFeedback />
    </div>
  );
}
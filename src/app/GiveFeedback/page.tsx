import FeedbackForm from "./FeedbackForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function GiveFeedback() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <main className="min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-black mb-4 text-center">
          Give Feedback
        </h2>
        <FeedbackForm />
      </div>
    </main>
  );
}
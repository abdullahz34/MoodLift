import CreateForm from "./FeedbackForm"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function GiveFeedback() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  
  return (
    <main className="bg-primary">
      <h2>Give Feedback</h2>
      <CreateForm />
    </main>
  )
}
import CreateForm from "./FeedbackForm"
export default async function GiveFeedback() {
  return (
    <main className="bg-primary">
      <h2>Give Feedback</h2>
      <CreateForm />
    </main>
  )
}
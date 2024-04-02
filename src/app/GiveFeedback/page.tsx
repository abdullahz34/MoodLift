import CreateForm from "./FeedbackForm"
export default async function GiveFeedback() {
  return (
    <main>
      <h2 className="text-primary text-center">Give Feedback</h2>
      <CreateForm />
    </main>
  )
}
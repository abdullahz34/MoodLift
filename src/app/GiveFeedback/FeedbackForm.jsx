"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

const FeedbackForm = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [includeUsername, setIncludeUsername] = useState(false);
  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = includeUsername && session.user ? session.user.name : "";
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, username }),
      });

      if (res.ok) {
        setSuccess(true);
        setMessage("");
        setError("");
      } else {
        const { msg } = await res.json();
        setError(msg);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("An error occurred while submitting feedback.");
      setSuccess(false);
    }
  };

  const handleIncludeUsernameChange = (e) => {
    setIncludeUsername(e.target.checked);
  };

  return (
    <div className="flex justify-center items-start h-screen pt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <label>
            <textarea
              required
              rows={6}
              className="text-[darkblue] w-full resize-none rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-4"
              placeholder="Write your feedback here..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </label>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
            <div className="flex items-center">
              <label className="pr-2 text-gray-700 font-medium">
                Include username
              </label>
              <input
                type="checkbox"
                checked={includeUsername}
                onChange={handleIncludeUsernameChange}
                className="toggle toggle-success"
              />
            </div>
          </div>
          {error && <p className="text-red-500 font-medium">{error}</p>}
          {success && (
            <p className="text-green-500 font-medium">
              Feedback submitted successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
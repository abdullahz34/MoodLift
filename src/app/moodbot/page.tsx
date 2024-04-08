'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useSession } from "next-auth/react"
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai")


async function getLogbookData(username) {
  const response = await fetch(`http://localhost:3000/api/logging?username=${username}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Response for the logging API call failed for username: ${username}`);
  }
  const data = await response.json();
  console.log('Data from getData:', data);

  // Find all objects for the selected username
  const items = data.filter(item => item.username === username);

  console.log('Items from getData:', items);

  // Return the entire items array, or an empty array if no items were found
  return items || [];
}

async function getData(endpoint) {
  const response = await fetch(`http://localhost:3000/api/${endpoint}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Response for the ${endpoint} API call failed.`);
  }
  const data = await response.json();
  console.log(`Data from ${endpoint}:`, data);

  // Return the entire data object, or an empty object if no data was found
  return data || {};
}


async function main(userMessage, username) {
  const endpoint = "https://testingpoc.openai.azure.com/"
  const client = new OpenAIClient(
    endpoint,
    new AzureKeyCredential("7d88a30a0aaa46beacc48b8dc23a95ef")
  )


  const deploymentId = "testing"

  const logbookData = await getLogbookData(username);
  const videoData = await getData('videos');
  const recipeData = await getData('recipes');

  const messages = [
    { role: "system", content: "You are Moodbot for the application Moodlift, a personal wellbeing assistant, helping users with their well being enquiries." },
    { role: "system", content: "Here at FDM we value wellbeing. Incorporate FDM values such as diversity, respect, integrity, and professional growth as you strive to support our employees' wellbeing and mental health." },
    { role: "system", content: "Moodlift has several features to support wellbeing, including the ability to book appointments with mental health ambassadors. If the information provided by moodbot is not enough, users are encouraged to book an appointment for further assistance." },
    { role: "system", content: "Moodlift also includes trackers for hydration, nutrition, fitness, and sleep. These trackers allow users to input and monitor their daily habits, which can be a useful tool for improving wellbeing. Users can access these trackers through the navbar." },
    { role: "system", content: "Moodlift provides resources where users can view recipes and videos curated by professional mental health ambassadors." },
    { role: "system", content: "Moodlift has a messages channel where users can communicate with their appointed ambassadors. Once an appointment is booked, the ambassador will show up in the inbox 30 minutes prior." },
    { role: "system", content: "Moodlift includes a survey feature where users are prompted to fill out a survey either daily, weekly or monthly. Mental health ambassadors can see this information and directly reach out to users." },
    { role: 'system', content: `Here is your logbook data: ${JSON.stringify(logbookData, null, 2)}` },
    { role: 'system', content: `Here is your video data: ${JSON.stringify(videoData, null, 2)}` },
    { role: 'system', content: `Here is your recipe data: ${JSON.stringify(recipeData, null, 2)}` },
    { role: "user", content: userMessage },
  ]

  if (!userMessage.trim()) {
    return ["Please enter a message."]
  }

  console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

  const events = await client.streamChatCompletions(deploymentId, messages, { maxTokens: 800 })

  const responses = []
  for await (const event of events) {
    for (const choice of event.choices) {
      const delta = choice.delta?.content
      if (delta !== undefined) {
        responses.push(delta)
      }
    }
  }
  return responses
}

const Moodbot = () => {
  const { data: session } = useSession()
  const firstname = session?.user?.name
  const username = session?.user?.username
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'moodbot',
      text: `Hi ${firstname || 'there'}, I'm Moodbot, your personal wellbeing assistant. Here at FDM we value wellbeing, I'll be trying my best to answer all your wellbeing enquiries!`,
      timestamp: new Date().toLocaleString(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const handleSubmit = async () => {
    if (userInput.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: userInput, timestamp: new Date().toLocaleString() },
      ])
      setLoading(true)
      const response = await main(userInput, username)
      if (response.length === 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'moodbot', text: "I don't understand. Could you please rephrase your query?", timestamp: new Date().toLocaleString() },
        ])
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'moodbot', text: response, timestamp: new Date().toLocaleString() },
        ])
      }
      setUserInput('')
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit()
      event.preventDefault() // Prevent the default Enter key behavior
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="grid grid-rows-[1fr_auto] h-[calc(100vh-68px)]">
      {/* Chat Container */}
      <div className="h-full overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${message.sender === 'user' ? 'chat-end' : 'chat-start'}`}
          >
            <div className="chat-bubble relative">
              {message.sender === 'moodbot' && (
                <div className="flex items-center mb-2">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src="/moodbot-avatar.png" alt="Moodbot Avatar" />
                    </div>
                  </div>
                  <span className="ml-2 font-bold">Moodbot</span>
                </div>
              )}
              {message.text}
              <span className="tooltip absolute top-0 right-2" data-tip={message.timestamp}>
                <i className="fas fa-clock text-xs"></i>
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble flex items-center">
              <span className="loading loading-ball loading-xs mr-2"></span>
              Moodbot is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="p-4 bg-base-300 flex">
        <textarea
          className="textarea textarea-bordered flex-1 mr-2"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Moodbot
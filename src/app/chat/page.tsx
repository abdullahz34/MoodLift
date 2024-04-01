'use client' // client side rendering
import React, { useState, useEffect } from 'react';
import * as io from 'socket.io-client';
import './styles.css'; // Assuming you're using CSS modules
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const socket = io.connect('https://socketio-server-moodlift-6d8efa596f7a.herokuapp.com/');

const Chat = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [ambassadors, setAmbassadors] = useState([]);
  const [message, setMessage] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          headers: {
            'Cookie': document.cookie.toString(),
          }
        });
        const data = await response.json();
        setCurrentUser(data.user.username);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Fetch users and ambassadors
    const fetchUsersAndAmbassadors = async () => {
      try {
        const usersResponse = await fetch('/users');
        const usersData = await usersResponse.json();
        setUsers(usersData.filter(user => user.username !== currentUser));

        const ambassadorsResponse = await fetch('/ambassadors');
        const ambassadorsData = await ambassadorsResponse.json();
        setAmbassadors(ambassadorsData); // You might want to filter these as well
      } catch (error) {
        console.error('Error fetching users or ambassadors:', error);
      }
    };

    fetchUsersAndAmbassadors();
  }, [currentUser]);

  const handleUserSelect = (username: string) => {
    setSelectedUser(username);
    // Fetch chat history with selected user
    fetchChatHistory(username);
  };

  const fetchChatHistory = async (username: string) => {
    if (!currentUser) return;
    try {
      console.log("fetching chat history");
      const response = await fetch(`/api/messages/${currentUser}/${username}`);
      //console.log(await response.json());
      const chatHistory: Message[] = await response.json();
      console.log(chatHistory);
      setMessages(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const setMessages = (chatHistory: Message[]) => {
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = '';
    chatHistory.forEach((message) => {
      const messageElement = document.createElement('li');
      messageElement.textContent = `${message.content}`; // (${new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`;
      messageElement.className = message.username === currentUser ? 'sent' : 'received';
      // set new line for each message by adding br tag
      //const br = document.createElement('br');
      //white-space: pre;messageElement.appendChild(br);
      messageList.appendChild(messageElement);
      const br = document.createElement('br');
      // close br
      const br2 = document.createElement('br');
      messageList.appendChild(br);
      messageList.appendChild(br2);
    });
  };

  const setMsgSent = (message) => {
    const messageList = document.getElementById('message-list');
    console.log("messageList", messageList);
    const messageElement = document.createElement('li');
    messageElement.textContent = `${message.content}`; // (${new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`;
    messageElement.className = message.user === currentUser ? 'sent' : 'received';
    //const br = document.createElement('br');
    //messageElement.appendChild(br);
    messageList.appendChild(messageElement);
    const br = document.createElement('br');
    // close br
    const br2 = document.createElement('br');
    messageList.appendChild(br);
    messageList.appendChild(br2);
    console.log("messageElement", messageElement);
  }

  const handleSendMessage = () => {
    if (messageInput.trim() !== '' && selectedUser) {
      console.log('sending message', messageInput);
      socket.emit('chatMessage', { user: currentUser, recipient: selectedUser, content: messageInput });
      setMsgSent({ user: currentUser, recipient: selectedUser, content: messageInput });
      setMessageInput('');
      // Add message to local state if needed
    }
  };

  if (status==="loading") return null

  if(status!=="loading" && !session) return router.replace("login")

  const handleClick = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    signOut()
  }


  return (
    <div className="MoodLift">
      <header>
        <h1>Inbox</h1>
        <a href="/logout">Logout</a>
      </header>
      <div className="container">
        <aside className="sidebar">
          <div className="search-container">
            <input type="text" id="search-input" placeholder="Search..." />
          </div>
          <ul id="user-list">
            {users.map(user => (
              <li key={user.username} onClick={() => handleUserSelect(user.username)}>
                {user.name} ({user.username})
              </li>
            ))}
          </ul>
        </aside>
        <main className="chat-container">
          <header className="chat-header">
            <h2>Chat</h2>
            <div className="user-info">
              <h3>{selectedUser}</h3>
            </div>
          </header>
          <div id="chat">
            <ul id="message-list">
            </ul>
          </div>
          <div className="message-box">
            <input
              type="text"
              id="message-input"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button id="send-msg-btn" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;

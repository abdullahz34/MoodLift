'use client'
import { withAuth } from "@/components/WithAuth";
import React, { useState, useEffect, useRef } from 'react';
import * as io from 'socket.io-client';
import './styles.css';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from 'next-auth';

const Chat = () => {
  const socket = io.connect('https://socketio-server-moodlift-6d8efa596f7a.herokuapp.com/');

  const { data: session, status } = useSession();
  const router = useRouter();

  const divRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserDisplay, setSelectedUserDisplay] = useState(null);
  const [users, setUsers] = useState([]);
  const [ambassadors, setAmbassadors] = useState([]);
  const [message, setMessage] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSender, setLastSender] = useState(null);
  let lastSender2 = null;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          headers: {
            'Cookie': document.cookie.toString(),
          }
        });
        const data = await response.json();
        setCurrentUser(data.user.username);
        setCurrentUserRole(data.user.type);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsersAndAmbassadors = async () => {
      try {
        const usersResponse = await fetch('/users');
        const usersData = await usersResponse.json();
        const listAllUsersFound = [];
        for (let i = 0; i < usersData.length; i++) {
          listAllUsersFound.push(usersData[i]);
        }
        const ambassadorsResponse = await fetch('/ambassadors');
        const ambassadorsData = await ambassadorsResponse.json();
        let listReturn = [];
        if (currentUserRole !== 'Employee') {
          for (let i = 0; i < ambassadorsData.length; i++) {
            listReturn.push(ambassadorsData[i]);
          }
        } else {
          for (let i = 0; i < ambassadorsData.length; i++) {
            if (true) {
              const apptStatus = await getAppointments(currentUser, ambassadorsData[i].username);
              if (apptStatus) {
                listReturn.push(ambassadorsData[i]);
              }
            }
          };
          for (let i = 0; i < listReturn.length; i++) {
            listAllUsersFound.push(listReturn[i]);
          }
        }
        listAllUsersFound.filter(
          (item, index) => listAllUsersFound.findIndex(t => t.username === item.username) === index
        );
        setUsers(listAllUsersFound.filter(user => user.username !== currentUser).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching users or ambassadors:', error);
      }
    };

    fetchUsersAndAmbassadors();
  }, [currentUser]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.trim());
  };

  useEffect(() => {
      const fetchSearchResults = async () => {
        try {
          setUsers([]);
          const response = await fetch(`/search?query=${searchQuery}`);
          const results: User[] = await response.json();
          const ambassadorsResponse = await fetch(`/ambassadors`);
          const ambassadorsData = await ambassadorsResponse.json();
          let listReturn = [];
          for (let i = 0; i < ambassadorsData.length; i++) {
            if (ambassadorsData[i].username.toLowerCase().includes(searchQuery) || ambassadorsData[i].name.toLowerCase().includes(searchQuery)) {
              if (true) {
                const apptStatus = await getAppointments(currentUser, ambassadorsData[i].username);
                if (apptStatus) {
                  listReturn.push(ambassadorsData[i]);
                }
              }
            };
          };
          for (let i = 0; i < listReturn.length; i++) {
            results.push(listReturn[i]);
          }
          const finalresult = results.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.username === value.username
            ))
          )
          setUsers(finalresult.filter(user => user.username !== currentUser).sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

      fetchSearchResults();
  }, [searchQuery, currentUser]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== '' && selectedUser) {
      const id1 = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      socket.emit('chatMessage', { user: currentUser, recipient: selectedUser, content: messageInput, id: id1 });
      setMsgSent({ user: currentUser, recipient: selectedUser, content: messageInput});
      setMessageInput('');
    }
  };

  useEffect(() => {
    const handleMessageReceive = (message) => {
      if ((message.user === selectedUser && message.recipient === currentUser)) {
              const messageList = document.getElementById('message-list');
              const messageElement = document.createElement('li');
          
              if (lastSender !== message.user) {
                  setLastSender(message.user);
                  const timestamp = new Date();
                  const timeLocal = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  const timeElement = document.createElement('li');
                  timeElement.textContent = `${currentUser} ${timeLocal}`;
                  timeElement.className = message.user === currentUser ? 'time-received' : 'time-sent';
                  messageList.appendChild(timeElement);
              }
          
              messageElement.textContent = `${message.content}`;
              messageElement.className = message.user === currentUser ? 'sent' : 'received';
              messageList.appendChild(messageElement);
              const br = document.createElement('br');
              const br2 = document.createElement('br');
              messageList.appendChild(br);
              messageList.appendChild(br2);
              listMsgId.push(message.id);
      }
    };

    socket.on('message', handleMessageReceive);

    return () => {
      socket.off('message', handleMessageReceive);
    };
  }, [selectedUser, currentUser, lastSender]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user.username);
    setSelectedUserName(user.name);
    setSelectedUserDisplay(`(${user.username})`);
    fetchChatHistory(user.username);
  };

  const fetchChatHistory = async (username: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/messages/${currentUser}/${username}`);
      const chatHistory: Message[] = await response.json();
      setMessages(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('divRef not set');
    }
  });

  const getAppointments = async (user: string, ambassador: string) => {
    const aptsResponse = await fetch(`/api/ambassadors/${ambassador}/${user}/appointments`);
    const appointments: Appointments[] = await aptsResponse.json();
    let appointmentFound = false;
    appointments.forEach(appointment => {
      const currentTime = new Date();
      const thirtyMinutesBefore = new Date(appointment.schedule);
      thirtyMinutesBefore.setMinutes(thirtyMinutesBefore.getMinutes() - 30);
      const fourHoursAfter = new Date(appointment.schedule);
      fourHoursAfter.setHours(fourHoursAfter.getHours() + 4);
      if (currentTime >= thirtyMinutesBefore && currentTime <= fourHoursAfter) {
        appointmentFound = true;
      }
      if (appointmentFound) return appointmentFound;
    });
    return appointmentFound;
  };


  const setMessages = (chatHistory) => {
      const messageList = document.getElementById('message-list');
      messageList.innerHTML = '';
      chatHistory.forEach((message) => {
          const messageElement = document.createElement('li');

          if (lastSender2 !== message.username) {
              const timestamp = new Date(message.timestamp);
              const timeLocal = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              const timeElement = document.createElement('li');
              timeElement.textContent = `${message.username} ${timeLocal}`;
              timeElement.className = message.username === currentUser ? 'time-received' : 'time-sent';
              messageList.appendChild(timeElement);
          }
          messageElement.textContent = `${message.content}`;
          messageElement.className = message.username === currentUser ? 'sent' : 'received';
          messageList.appendChild(messageElement);
          const br = document.createElement('br');
          const br2 = document.createElement('br');
          messageList.appendChild(br);
          messageList.appendChild(br2);
        lastSender2 = message.username;
      });
  };

  const setMsgSent = (message) => {
    const messageList = document.getElementById('message-list');
    const messageElement = document.createElement('li');
    if (lastSender !== message.user) {
        const timestamp = new Date();
        const timeLocal = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const timeElement = document.createElement('li');
        timeElement.textContent = `${currentUser} ${timeLocal}`;
        timeElement.className = message.user === currentUser ? 'time-received' : 'time-sent';
        messageList.appendChild(timeElement);
    }

    messageElement.textContent = `${message.content}`;
    messageElement.className = message.user === currentUser ? 'sent' : 'received';
    messageList.appendChild(messageElement);
    const br = document.createElement('br');
    const br2 = document.createElement('br');
    messageList.appendChild(br);
    messageList.appendChild(br2);
    setLastSender(message.user);
  };


  if (status==="loading") return null

  if(status!=="loading" && !session) return router.replace("login")

  const handleClick = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    signOut()
  }

  return (
    <div className="MoodLift">
      <div className="container">
        <aside className="sidebar">
          <div className="search-container">
            <input type="text" id="search-input" placeholder="Search..." onChange={handleSearchChange} />
          </div>
          <ul id="user-list">
            {users.map(user => (
              <li key={user.username} onClick={() => handleUserSelect(user)}>
                {user.name} ({user.username}) <br/> {user.type}
              </li>
            ))}
          </ul>
        </aside>
        <main className="chat-container">
          <header className="chat-header">
            <h2>Chat</h2>
            <div className="user-info">
              <h3>{selectedUserName} {selectedUserDisplay}</h3>
            </div>
          </header>
          <div id="chat">
            <ul id="message-list">
            </ul>
            <div ref={divRef}></div>
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

export default withAuth(Chat);

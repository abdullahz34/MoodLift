'use client' // client side rendering
import React, { useState, useEffect, useRef } from 'react';
import * as io from 'socket.io-client';
import './styles.css'; 
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from 'next-auth';

const socket = io.connect('https://socketio-server-moodlift-6d8efa596f7a.herokuapp.com/');

const Chat = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const divRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [ambassadors, setAmbassadors] = useState([]);
  const [message, setMessage] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  let lastSender = null;

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
    // Fetch users and ambassadors
    const fetchUsersAndAmbassadors = async () => {
      try {
        const usersResponse = await fetch('/users');
        const usersData = await usersResponse.json();
        //setUsers(usersData.filter(user => user.username !== currentUser));
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
              console.log('User role:', currentUserRole);
              const apptStatus = await getAppointments(currentUser, ambassadorsData[i].username);
              console.log('Appointment status:', apptStatus);
              if (apptStatus) {
                listReturn.push(ambassadorsData[i]);
              }
            }
          };
          for (let i = 0; i < listReturn.length; i++) {
            listAllUsersFound.push(listReturn[i]);
          }
        }
        setUsers(listAllUsersFound.filter(user => user.username !== currentUser).sort((a, b) => a.name.localeCompare(b.name)));
        //setUsers(results.filter(user => user.username !== currentUser).sort((a, b) => a.name.localeCompare(b.name)));
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
    if (searchQuery !== '') {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`/search?query=${searchQuery}`);
          const results: User[] = await response.json();
          //setUsers(results.filter(user => user.username !== currentUser));
          const ambassadorsResponse = await fetch(`/ambassadors`);
          const ambassadorsData = await ambassadorsResponse.json();
          let listReturn = [];
          for (let i = 0; i < ambassadorsData.length; i++) {
            // filter
            if (ambassadorsData[i].username.toLowerCase().includes(searchQuery) || ambassadorsData[i].name.toLowerCase().includes(searchQuery)) {
              if (true) {
                const apptStatus = await getAppointments(currentUser, ambassadorsData[i].username);
                console.log('Appointment status:', apptStatus);
                if (apptStatus) {
                  listReturn.push(ambassadorsData[i]);
                }
              }
            };
          };
          for (let i = 0; i < listReturn.length; i++) {
            results.push(listReturn[i]);
          }
          setUsers(results.filter(user => user.username !== currentUser).sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

      fetchSearchResults();
      // Optionally search for ambassadors
      // Add your fetch call here following the same pattern as above
    }
  }, [searchQuery, currentUser]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user.username);
    // Fetch chat history with selected user
    fetchChatHistory(user.username);
  };

  const fetchChatHistory = async (username: string) => {
    if (!currentUser) return;
    try {
      console.log("fetching chat history");
      const response = await fetch(`/api/messages/${currentUser}/${username}`);
      //console.log(await response.json());
      const chatHistory: Message[] = await response.json();
      setMessages(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  /* const searchAmbassador = async (query: string) => {
    try {
      const response = await fetch(`/ambassadors`);
      const ambassador: Ambassador = await response.json();
      const listReturn = [];
      for (let i = 0; i < ambassador.length; i++) {
        const apptStatus = await getAppointments(currentUser, ambassador[i].username);
        console.log('Appointment status:', apptStatus);
        if (apptStatus) {
          listReturn.push(ambassador[i]);
        }
      }
      return listReturn;
    } catch (error) {
      console.error('Error fetching ambassador:', error);
    }
  }; */

  /* const handleSearch = () => {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue === '') {
      setUsers(users);
      return;
    } else {
      const user = searchUser(searchValue);
      const ambassador = searchAmbassador(searchValue);
      const listReturn = [];
      listReturn.push(user);
      listReturn.push(ambassador);
      setUsers(listReturn);
    }
  }; */

  useEffect(() => {
    // check if the divRef is set
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('divRef not set');
    }
  });
  
  /* update chat by every 3 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedUser) {
        fetchChatHistory(selectedUser);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [selectedUser]);

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
        console.log('Appointment:', appointment);
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

          // Add timestamp only when the sender changes.
          if (lastSender !== message.username) {
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

          // Update the lastSender with the current message's username.
          lastSender = message.username;
      });
  };

  const setMsgSent = (message) => {
    const messageList = document.getElementById('message-list');
    console.log("messageList", messageList);
    const messageElement = document.createElement('li');

    // Add timestamp only when the sender changes.
    if (lastSender !== message.username) {
        const timestamp = new Date();
        const timeLocal = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const timeElement = document.createElement('li');
        timeElement.textContent = `${message.username} ${timeLocal}`;
        console.log("timeElement", timeLocal);
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
    console.log("messageElement", messageElement);

    // Update the lastSender with the current message's username.
    lastSender = message.username;
  };

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
              <h3>{selectedUser}</h3>
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

export default Chat;

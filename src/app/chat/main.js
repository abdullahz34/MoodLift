// public/main.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let selectedUser = null;

    const currentUser = fetch('/api/auth/session').then(response => response.json()).then(data => {
        console.log('Current user:', data.user.username);
        return data.user.username;
    }).catch(error => console.error('Error fetching current user:', error));

    fetch('/users')
        .then(response => response.json())
        .then(users => {
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            users.forEach(user => {
                if (user !== currentUser) { // Exclude current user from the list
                    const listItem = document.createElement('li');
                    listItem.textContent = user.name + ' (' + user.username + ')';
                    listItem.addEventListener('click', () => {
                        selectUser(user.username);
                    });
                    userList.appendChild(listItem);
                }
            });
            fetch(`/ambassadors`).then(response => response.json()).then(
                ambassadors => {
                    ambassadors.forEach(ambassador => {
                        if (getAppointments(currentUser, ambassador.username)) {
                            const listItem = document.createElement('li');
                            listItem.textContent = ambassador.name + ' (' + ambassador.username + ')';
                            listItem.addEventListener('click', () => {
                                selectUser(ambassador.username);
                            });
                            userList.appendChild(listItem);
                        }
                    });
                }
            )
        })
        .catch(error => console.error('Error fetching users:', error));

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        fetch(`/search?query=${query}`)
            .then(response => response.json())
            .then(results => {
                const userList = document.getElementById('user-list');
                userList.innerHTML = '';
                results.forEach(user => {
                    if (user.name !== currentUser) { // Exclude current user from search results
                        const listItem = document.createElement('li');
                        listItem.textContent = user.name + ' (' + user.username + ')';
                        listItem.addEventListener('click', () => {
                            console.log('Selected user:', user);
                            selectUser(user.username);
                        });
                        userList.appendChild(listItem);
                    }
                });
            })
            .catch(error => console.error('Error searching users:', error));
        fetch(`/ambassadors`).then(response => response.json()).then(
            ambassadors => {
                ambassadors.forEach(ambassador => {
                    if (getAppointments(currentUser, ambassador.username)) {
                        const listItem = document.createElement('li');
                        listItem.textContent = ambassador.name + ' (' + ambassador.username + ')';
                        listItem.addEventListener('click', () => {
                            selectUser(ambassador.username);
                        });
                        userList.appendChild(listItem);
                    }
                });
            }
        )
    });

    function displaySelectedUser(userId) {
        fetch('/users').then(response => response.json()).then(users => {
            users.forEach(user => {
                if (user.username === userId) {
                    const selectedUserElement = document.getElementById('chat-username');
                    selectedUserElement.innerHTML = '';
                    const userElement = document.createElement('h2');
                    userElement.textContent = user.name + ' (' + user.username + ')';
                    selectedUserElement.appendChild(userElement);
                }
            });
        });
    }

    function selectUser(user) {
        selectedUser = user;
        console.log('Selected user:', selectedUser, ', fetching chat history...');
        displaySelectedUser(user);
        fetchChatHistory(user);
    }

    function fetchChatHistory(user) {
        fetch(`/api/messages/${currentUser}/${user}`)
            .then(response => response.json())
            .then(messages => {
                const messageList = document.getElementById('message-list');
                messageList.innerHTML = ''; // Clear previous messages
                messages.forEach(msg => {
                    const messageElement = document.createElement('li');
                    messageElement.textContent = `${msg.content}`;// (${new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`;
                    messageElement.className = msg.username === currentUser ? 'sent' : 'received';
                    messageList.appendChild(messageElement);
                });
            })
            .catch(error => console.error('Error fetching chat history:', error));
    }

    function getAppointments(user, ambassador) {
        fetch(`/api/ambassador/${ambassador}/${user}/appointments`)
            .then(response => response.json())
            .then(appointments => {
                appointments.forEach(appointment => {
                    const currentTime = new Date();
                    const thirtyMinutesBefore = new Date(appointment.schedule);
                    thirtyMinutesBefore.setMinutes(thirtyMinutesBefore.getMinutes() - 30);
                    const fourHoursAfter = new Date(appointment.schedule);
                    fourHoursAfter.setHours(fourHoursAfter.getHours() + 4);
                    if (currentTime >= thirtyMinutesBefore && currentTime <= fourHoursAfter) {
                        console.log('Appointment:', appointment);
                        return true;
                    }
                });
                console.log('No appointments found');
                return false;
            })
            .catch(error => console.error('Error fetching appointments:', error));
    }

    const sendMessageButton = document.getElementById('send-msg-btn');
    sendMessageButton.addEventListener('click', () => {
        sendMessage();
    })

    function sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();

        if (message !== '' && selectedUser) {
            console.log('Sending message:', message, 'from', currentUser, 'to', selectedUser);
            socket.emit('chatMessage', { user: currentUser, recipient: selectedUser, content: message});
            messageInput.value = '';
        } else {
            console.log('Please select a user and type a message.');
        }
    }

    function retrieveUserName(currentUserId) {
        fetch(`/users`)
            .then(response => response.json())
            .then(users => {
                users.forEach(user => {
                    if (user.username === currentUserId) {
                        return user.name;
                    }
                });
            })
            .catch(error => console.error('Error fetching current user:', error));
    }

    function retrieveUserId(currentUserId) {
        fetch(`/api/names/${currentUserId}`)
            .then(response => response.json())
            .then(users => {
                users.forEach(user => {
                    if (user.name === currentUserId) {
                        return user.username;
                    }
                });
            })
            .catch(error => console.error('Error fetching current user:', error));
    }

    socket.on('message', (message) => {
        if ((message.user === currentUser && message.recipient === selectedUser) || (message.user === selectedUser && message.recipient === currentUser)) {
            const messageList = document.getElementById('message-list');
            const messageElement = document.createElement('li');
            messageElement.textContent = `${message.content}`; // (${new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`;
            messageElement.className = message.user === currentUser ? 'sent' : 'received';
            messageList.appendChild(messageElement);
        }
    });
});

// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require("dotenv").config();

const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust according to your security requirements
  },
});

const MONGODB_URI = "mongodb+srv://mlhmytran:541AxS8g7jm9EEy9@cluster0.uthobww.mongodb.net/"

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const Message = require('./models/message'); // Your existing message model
const User = require('./models/user'); // Make sure to create this model
const Appointments = require('./models/appointments'); // Make sure to create this model
const { all } = require('axios');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

// API Routes
// Fetch chat history between two users
app.get('/api/messages/:user1/:user2', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { username: req.params.user1, recipient: req.params.user2 },
                { username: req.params.user2, recipient: req.params.user1 },
            ],
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch the list of users excluding the current user
app.get('/api/users/:currentUser', async (req, res) => {
    try {
        const users = await User.find({ username: { $ne: req.params.currentUser } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/ambassador/:currentUser/:userAppointment/appointments', async (req, res) => {
    try {
        const users = await Appointments.find({ ambassador: req.params.currentUser, user: req.params.userAppointment });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch the list of users excluding the current user
app.get('/api/names/:currentUser', async (req, res) => {
    try {
        const users = await User.find({ name: { $ne: req.params.currentUser } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        const allUsers = [];
        const users = await User.find({ username: { $regex: query, $options: 'i' }, isEmployee: true});
        const usersByName = await User.find({ name: { $regex: query, $options: 'i' }, isEmployee: true });
        allUsers.push(...users);
        usersByName.forEach(user => {
            if (!(allUsers.includes(user.username))) {
                allUsers.push(user);
            }
        });
        res.json((allUsers.map(user => ({ name: user.name, username: user.username })).sort((a, b) => a.name.localeCompare(b.name))).filter(user => user.username !== req.query.currentUser).filter((user, index, self) => self.findIndex(t => t.username === user.username) === index));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({ username: { $regex: '', $options: 'i' }, isEmployee: true});
        res.json(users.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/ambassadors', async (req, res) => {
    try {
        const users = await User.find({ username: { $regex: '', $options: 'i' }, isAmbassador: true});
        res.json(users.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Socket.io event handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming chat messages
    socket.on('chatMessage', async (data) => {
        const { user, recipient, content } = data;
        const message = new Message ({
            username: user,
            recipient: recipient,
            content: content,
        });

        await message.save(); // Save message to MongoDB
        io.emit('message', data); // Broadcast message to all clients
    });
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


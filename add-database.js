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

// Create a random user database and add to mongoDB

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function generateRandomUser() {
    const username = Math.random().toString(36).substring(7); // random string generator
    const isAdmin = Math.random() < 0.05; // 10% chance of being an admin
    const name = randomChoice(['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivan', 'Julia', 'Kevin', 'Linda', 'Michael', 'Nancy', 'Oscar', 'Pamela', 'Quentin', 'Rachel', 'Steve', 'Tina', 'Ulysses', 'Victoria', 'Walter', 'Xena', 'Yvonne', 'Zack']);
    if (isAdmin) {
        isEmployee = false;
        isAmbassador = false;
    } else {
        isEmployee = Math.random() < 0.8; // 80% chance of being an employee
        if (isEmployee) {
            isAmbassador = false;
        } else {
            isAmbassador = true;
        }
    }
    const createdAt = Date.now();
    return { username, name, isAdmin, isEmployee, isAmbassador, createdAt };
}

listUsers = [generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser(), generateRandomUser()]
console.log(listUsers);
// Add users to the database
const User = require('./models/user');
User.insertMany(listUsers).then(() =>{
    console.log('Users added to the database');
})
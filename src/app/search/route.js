import User from '../../../models/userSchema';
import connect from "../../../db";
import { NextResponse } from 'next/server';

// Write a function that fetches all ambassadors from the database for /ambassadors and returns them as JSON
export async function GET(req) {
    try {
        await connect();
        //console.log(req.url);
        // get the query from the request
        // currentUser is being authenticated in /api/auth/session and return userid 
        // get cookies from the request
        // fetch the /api/auth/session and get the user from the response with using the cookies
        const currentUser = await fetch('http://localhost:3000/api/auth/session', {headers: {
            cookie: req.cookies.toString()
        }}).then(res => res.json()).then(data => data.user.username);
        console.log(currentUser);
        const query = req.url.split('query=')[1].split('&')[0];
        //console.log(req.url.split('query=')[1]);
        const allUsers = [];
        const users = await User.find({ username: { $regex: query, $options: 'i' }, isEmployee: true});
        const usersByName = await User.find({ name: { $regex: query, $options: 'i' }, isEmployee: true });
        allUsers.push(...users);
        usersByName.forEach(user => {
            if (!(allUsers.includes(user.username))) {
                allUsers.push(user);
            }
        });
        const sortedList = [];
        allUsers.forEach(user => {
            console.log(user.username, user.name);
            if (!(sortedList.includes(user.username))) {
                sortedList.push({username: user.username, name: user.name});
        }
        });
        console.log(sortedList);
        // remove currentUser from the list
        allUsers.filter(user => sortedList.includes(user.username));
        // sort name alphabetically
        allUsers.sort((a, b) => a.name.localeCompare(b.name));
        // sort username alphabetically
        allUsers.sort((a, b) => a.username.localeCompare(b.username));
        return NextResponse.json(allUsers);

    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
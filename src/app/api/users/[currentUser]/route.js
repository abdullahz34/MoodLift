import connect from "../../../../../db";
import User from "../../../../../models/userSchema";
import { NextResponse } from 'next/server';


export async function GET(req) {
    try {
        await connect();
        const currentUser = await fetch('http://localhost:3000/api/auth/session', {headers: {cookie: req.cookies.toString()}}).then(res => res.json()).then(data => data.user.username);
        const users = await User.find({ username: { $regex: currentUser } });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
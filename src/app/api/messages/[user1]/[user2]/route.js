import connect from "../../../../../../db"
import Message from "../../../../../../models/messageSchema";
import { NextResponse } from 'next/server';


export async function GET(req) {
    try {
        await connect();
        const currentUser = await fetch('http://localhost:3000/api/auth/session', {headers: {cookie: req.cookies.toString()}}).then(res => res.json()).then(data => data.user.username);
        const user2 = req.url.split("/")[6];
        console.log(req.url.split("/")[6]);
        console.log(currentUser, user2);
        const messages = await Message.find({
            $or: [
                { username: currentUser, recipient: user2},
                { username: user2, recipient: currentUser},
            ],
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
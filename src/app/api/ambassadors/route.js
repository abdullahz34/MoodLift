import connect from "../../../../../db";
import Appointments from "../../../../../models/appointmentsSchema";
import { NextResponse } from 'next/server';

// Write a function that fetches all ambassadors from the database for /ambassadors and returns them as JSON
export async function GET(req) {
    try {
        await connect();
        const userAppointment = await fetch('http://localhost:3000/api/auth/session', {headers: {cookie: req.cookies.toString()}}).then(res => res.json()).then(data => data.user.username);
        const currentUser = req.url.split("/")[-2];
        const users = await Appointments.find({ ambassador: currentUser, user: userAppointment });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
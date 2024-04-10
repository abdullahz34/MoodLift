import connect from "../../../../../../../db";
import Appointment from "../../../../../../../models/Appointment_Schema";
import { NextResponse } from 'next/server';
import { useSession } from "next-auth/react";


export async function GET(req) {
    try {
        await connect();
        const userAppointment = await fetch('http://localhost:3000/api/auth/session', {headers: {cookie: req.cookies.toString()}}).then(res => res.json()).then(data => data.user.username);
        const currentUser = req.url.split("/")[5];
        console.log('Current User for ambass: ', currentUser);
        const users = await Appointment.find({ Ambassador_username: currentUser, Employee_username: userAppointment });
        console.log('Ambassadors: ', users);
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
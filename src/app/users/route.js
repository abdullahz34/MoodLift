import User from '../../../models/userSchema';
import connect from "../../../db";
import { NextResponse } from 'next/server';

// Write a function that fetches all ambassadors from the database for /ambassadors and returns them as JSON
export async function GET() {
    try {
        await connect();
        const users = await User.find({ username: { $regex: '', $options: 'i' }, isEmployee: true});
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
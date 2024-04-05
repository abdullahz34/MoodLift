import User from '../../../models/userSchema';
import connect from "../../../db";
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        await connect();
        const ambassadors = await User.find({ username: { $regex: '', $options: 'i' }, type: "Ambassador"});
        return NextResponse.json(ambassadors);
    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
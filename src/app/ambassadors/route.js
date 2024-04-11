import User from '../../../models/userSchema';
import connect from "../../../db";
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        await connect();
        const ambassadors = await User.find({ username: { $regex: '', $options: 'i' }, type: "Ambassador"});
        const admins = await User.find({ username: { $regex: '', $options: 'i' }, type: "Admin"});
        ambassadors.push(...admins);
        const superAdmins = await User.find({ username: { $regex: '', $options: 'i' }, type: "Superadmin"});
        ambassadors.push(...superAdmins);
        return NextResponse.json(ambassadors);
    } catch (error) {
        console.error('Error fetching ambassadors: ', error);
        return NextResponse.json({ message: 'Error fetching ambassadors' }, { status: 500 });
    }
}
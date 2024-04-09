import { NextResponse } from 'next/server';
import connect from '../../../../../db';
import Goal from '../../../../../models/goalSchema';

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    await connect();
    const goals = await Goal.find({ username });
    console.log("Goals: ", goals)
    return new NextResponse(JSON.stringify(goals), {status:200});
  } catch (error) {
    console.error('Error in fetching goals:', error);
    const errorMessage = error.message || 'An error occurred while fetching goals';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
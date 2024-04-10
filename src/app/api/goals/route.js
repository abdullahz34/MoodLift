import { NextResponse } from 'next/server';
import connect from '../../../../db';
import Goal from '../../../../models/goalSchema';

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const goal_type = searchParams.get('goal_type');
    await connect();
    const goal = await Goal.findOne({ username, goal_type });
    console.log("Goal: ", goal)
    return new NextResponse(JSON.stringify(goal), {status:200});
  } catch (error) {
    console.error('Error in fetching goal:', error);
    const errorMessage = error.message || 'An error occurred while fetching goal';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const goal_type = searchParams.get('goal_type');
    const { value: updatedValue } = await request.json();
    console.log("updated value: ", updatedValue)
    await connect();
    await Goal.findOneAndUpdate({ username, goal_type }, { value: updatedValue });
    return NextResponse.json({ message: "Goal updated" }, { status: 200 });
  } catch (error) {
    console.error('Error in updating goal:', error);
    const errorMessage = error.message || 'An error occurred while updating goal';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const POST = async (request) => {
  try {
    const { username, goal_type, value} = await request.json();
    await connect();
    const newGoal = new Goal({ username, goal_type, value});
    await newGoal.save();
    return new NextResponse(JSON.stringify(newGoal), {status:200});
  } catch (error) {
    console.error('Error in creating goal:', error);
    const errorMessage = error.message || 'An error occurred while creating goal';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
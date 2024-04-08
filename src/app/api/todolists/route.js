import { NextResponse } from 'next/server';
import connect from '../../../../db';
import Todo from '../../../../models/todoSchema';

export const GET = async (request) => {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const date = searchParams.get('date');

    const todos = await Todo.find({ username, date });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Error in fetching to-do lists:', error);
    const errorMessage = error.message || 'An error occurred while fetching to-do lists';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const { username, date, tasks } = await request.json();
    await connect();

    const newTodoList = new Todo({ username, date, tasks });
    await newTodoList.save();

    return NextResponse.json({ message: 'To-do list created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in creating to-do list:', error);
    const errorMessage = error.message || 'An error occurred while creating to-do list';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
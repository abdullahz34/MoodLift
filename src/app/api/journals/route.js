import { NextResponse } from 'next/server';
import connect from '../../../../db';
import Journal from '../../../../models/journalSchema';

export const GET = async (request) => {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const date = searchParams.get('date');

    const journals = await Journal.find({ username, date });
    return NextResponse.json(journals, { status: 200 });
  } catch (error) {
    console.error('Error in fetching journal entries:', error);
    const errorMessage = error.message || 'An error occurred while fetching journal entries';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const { username, date, entry } = await request.json();
    await connect();

    const newJournalEntry = new Journal({ username, date, entry });
    await newJournalEntry.save();

    return NextResponse.json({ message: 'Journal entry created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in creating journal entry:', error);
    const errorMessage = error.message || 'An error occurred while creating journal entry';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
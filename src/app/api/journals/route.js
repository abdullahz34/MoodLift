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
    const { username, date, entry, mood } = await request.json();
    await connect();

    // Update the user's streak
    const lastEntry = await Journal.findOne({ username }).sort({ date: -1 });
    let streak = 0; // Set the initial streak to 0 for a new entry
    if (lastEntry) {
      const lastEntryDate = new Date(lastEntry.date);
      const today = new Date(date);
      const timeDiff = today.getTime() - lastEntryDate.getTime();
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (diffDays === 1) {
        streak = lastEntry.streak + 1; // Increment the streak if the new entry is on the next day
      } else {
        streak = 0; // Reset the streak if there's a gap between entries
      }
    }

    const newJournalEntry = new Journal({ username, date, entry, mood, streak });
    await newJournalEntry.save();
    return NextResponse.json({ message: 'Journal entry created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in creating journal entry:', error);
    const errorMessage = error.message || 'An error occurred while creating journal entry';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
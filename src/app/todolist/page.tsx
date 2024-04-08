'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState('');

  const { data: session } = useSession();
  const username = session?.user?.username;

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetchTodoList();
  }, [username, formattedDate]);

  const fetchTodoList = async () => {
    try {
      const todoResponse = await fetch(`/api/todolists?username=${username}&date=${formattedDate}`);
      const todoData = await todoResponse.json();

      // Check if the API returns an array of to-do lists
      if (Array.isArray(todoData)) {
        // Find the to-do list for the current date and username
        const currentTodoList = todoData.find(
          (list) =>
            new Date(list.date).toDateString() === new Date(formattedDate).toDateString() &&
            list.username === username
        );

        // Set the todoList state with the tasks from the found list, or an empty array if no list was found
        setTodoList(currentTodoList ? currentTodoList.tasks : []);
      } else {
        // Handle the case where the API doesn't return an array
        setTodoList(todoData.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching to-do list:', error);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/todolists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, date: formattedDate, tasks: [...todoList, newTask] }),
      });

      if (response.ok) {
        setNewTask('');
        await fetchTodoList(); // Fetch updated to-do list
      } else {
        console.error('Error creating to-do list');
      }
    } catch (error) {
      console.error('Error creating to-do list:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
        <form onSubmit={handleTaskSubmit}>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Task
          </button>
        </form>
        {todoList.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Tasks</h3>
            <ul>
              {todoList.map((task, index) => (
                <li key={index} className="mb-2">
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
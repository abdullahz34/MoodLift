'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const username = session?.user?.username;

  const today = new Date();
  const formattedTodayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetchTodoList();
  }, [username, selectedDate]);

  const fetchTodoList = async () => {
    try {
      const todoResponse = await fetch(`/api/todolists?username=${username}&date=${selectedDate || formattedTodayDate}`);
      const todoData = await todoResponse.json();
      if (Array.isArray(todoData)) {
        const currentTodoList = todoData.find(
          (list) =>
            new Date(list.date).toDateString() === new Date(selectedDate || formattedTodayDate).toDateString() &&
            list.username === username
        );
        setTodoList(currentTodoList ? currentTodoList.tasks : []);
      } else {
        setTodoList(todoData.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching to-do list:', error);
    }
  };

  const fetchQuote = async () => {
    setLoading(true);
    const categories = ['courage', 'dreams', 'fitness', 'happiness', 'hope', 'inspirational', 'life', 'success'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_QUOTE_API_KEY
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuote(data);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (newTask.trim() === '') {
      alert('Task cannot be empty');
      return;
    }
    try {
      const response = await fetch('/api/todolists', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, date: selectedDate || formattedTodayDate, tasks: [...todoList, { text: newTask, completed: false }] }),
      });
      if (response.ok) {
        setNewTask('');
        await fetchTodoList();
      } else {
        console.error('Error creating to-do list');
      }
    } catch (error) {
      console.error('Error creating to-do list:', error);
    }
  };

  const handleTaskDelete = async (index) => {
    try {
      const updatedTasks = [...todoList];
      updatedTasks.splice(index, 1);
      const response = await fetch('/api/todolists', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, date: selectedDate || formattedTodayDate, tasks: updatedTasks }),
      });
      if (response.ok) {
        await fetchTodoList();
      } else {
        console.error('Error deleting task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskUpdate = async (index, updatedText) => {
    if (updatedText.trim() === '') {
      alert('Edited task cannot be empty');
      return;
    }
    try {
      const updatedTasks = [...todoList];
      updatedTasks[index].text = updatedText;
      const response = await fetch('/api/todolists', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, date: selectedDate || formattedTodayDate, tasks: updatedTasks }),
      });
      if (response.ok) {
        await fetchTodoList();
      } else {
        console.error('Error updating task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTaskToggle = async (index) => {
    try {
      const updatedTasks = [...todoList];
      updatedTasks[index].completed = !updatedTasks[index].completed;
      const response = await fetch('/api/todolists', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, date: selectedDate || formattedTodayDate, tasks: updatedTasks }),
      });
      if (response.ok) {
        await fetchTodoList();
      } else {
        console.error('Error toggling task');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };


  return (
    <div className="container mx-auto py-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
        {loading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : (
          quote && quote.length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-gray-600 mb-2">Quote of the moment:</h3>
              <p className="text-lg text-gray-700 italic mb-4">{quote[0].quote}</p>
              <p className="text-gray-500 text-right">{quote[0].author}</p>
            </div>
          )
        )}
        {/* Add date dropdown */}
        <div className="mb-4">
          <label htmlFor="date" className="mr-2">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate || formattedTodayDate}
            onChange={handleDateChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Existing form for adding tasks */}
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
        {/* Display tasks with delete and edit icons */}
        {todoList.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Tasks</h3>
            <ul>
              {todoList.map((task, index) => (
                <li key={index} className="flex items-center justify-between mb-2">
                  <span
                    className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}
                    onClick={() => handleTaskToggle(index)}
                  >
                    {task.text}
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* Edit icon */}
                    <button
                      onClick={() => handleTaskUpdate(index, prompt('Edit task:', task.text))}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    {/* Delete icon */}
                    <button
                      onClick={() => handleTaskDelete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
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
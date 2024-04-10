'use client' // client side rendering

import React, { useState, useEffect } from "react";
import Users from "./Users";
import SearchUsers from "./SearchUsers";

export default function ModifySearch() {
  const [users, setUsers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/api/searchUser');
      const users = await response.json();
      setUsers(users);
    }

    getUsers();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-10 space-y-6">
      {submitted && (
        <div role="alert" className="alert alert-success fixed top-0 left-0 right-0 flex items-center justify-center mt-4 p-2 text-sm max-w-xs mx-auto z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>User successfully deleted!</span>
        </div>
      )}
      <SearchUsers getSearchResults={(results) => setUsers(results)} />
      <h1 className="text-xl font-bold text-gray-900 justify-center">Results</h1>
      <Users users={users} setSubmitted={setSubmitted} />
    </div>

  );
}
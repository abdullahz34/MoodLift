'use client' // client side rendering

import React, { useState, useEffect } from "react";
import Users from "./Users";
import SearchUsers from "./SearchUsers";

export default function ModifySearch() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('http://localhost:3000/api/searchUser');
      const users = await response.json();
      setUsers(users);
    }

    getUsers();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-10 space-y-6">
        <SearchUsers getSearchResults={(results) => setUsers(results)} />
        <h1 className="text-xl font-bold text-gray-900 justify-center">Results</h1>
        <Users users={users} />
    </div>

  );
}
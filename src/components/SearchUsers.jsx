'use client'

import Link from "next/link";
import { useState } from "react";

export default function SearchUsers({ getSearchResults }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(`/api/searchUser/search?query=${query}`)

    const user = await response.json()

    getSearchResults(user)

  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <h1 className="card-title text-xl font-bold text-gray-900 justify-center">Enter username</h1>
      <div className="card-body space-y-4" >
        <form className="space-y-4 flex space-x-2 items-center" onSubmit={handleSubmit}>
          <label className="input input-bordered input-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d ="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
              type="text"
              placeholder="Username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {error && (
            <div className="text-sm font-medium text-error">{error}</div>
          )}
          <div className="card-actions">
            <button className="btn btn-primary w-full mb-4">Search</button>
          </div>
        </form>
      </div>
    </div>
  )
}
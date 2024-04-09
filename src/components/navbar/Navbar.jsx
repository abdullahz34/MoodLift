'use client' // client side rendering
import React from 'react'
import Link from 'next/link'
import { render } from 'react-dom'

const Navbar = () => {

  const closeDropdown = () => {
    const detailsElement = document.querySelector('details');
    if (detailsElement) {
      detailsElement.removeAttribute('open');
    }
  }

  return (
    <nav className="navbar bg-base-100 px-12">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">MoodLift</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
        <li>
            <details>
              <summary>
                Logbook
              </summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li><Link href="/logbook/nutritionTracker" onClick={closeDropdown}>Nutrition</Link></li>
                <li><Link href="/logbook/fitnessTracker" onClick={closeDropdown}>Fitness</Link></li>
                <li><Link href="/logbook/sleepTracker" onClick={closeDropdown}>Sleep</Link></li>
                <li><Link href="/logbook/hydrationTracker" onClick={closeDropdown}>Hydration</Link></li>
              </ul>
            </details>
          </li>
          <li><Link href="/insights">Insights</Link></li>
          <li><Link href="/resources">Resources</Link></li>
          <li><Link href="/surveys">Survey</Link></li>
          <li><Link href="/Appointments">Appointments</Link></li>
          <li><Link href="/moodbot">MoodBot</Link></li>
        </ul>
        <div className="dropdown dropdown-end" id="login">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
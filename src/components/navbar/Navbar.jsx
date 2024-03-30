import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 px-12">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">MoodLift</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/resources">Resources</Link></li>
          <li><Link href="/logbook">Logbook</Link></li>
          <li><Link href="/insights">Insights</Link></li>
          <li><Link href="/survey">Survey</Link></li>
          <li><Link href="/appointments">Appointments</Link></li>
          <li><Link href="/moodbot">MoodBot</Link></li>
          <li>
            <details>
              <summary>
                Placeholder
              </summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li><a>Link 1</a></li>
                <li><a>Link 2</a></li>
              </ul>
            </details>
          </li>
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
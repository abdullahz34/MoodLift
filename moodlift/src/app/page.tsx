'use client' // client side rendering
import React from 'react'
import  Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div>
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </div>
    </main>
  );
}

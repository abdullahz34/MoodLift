'use client' // client side rendering
import React from 'react'
import  Link from 'next/link';

export default function Home() {
  return (
    <main>
      Hello World!
      <div>
        <Link href="/login">Login</Link>
      </div>
    </main>
  );
}

'use client' // client side rendering
import React from 'react'
import  Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter()

  if (status==="loading") return null

  if(status!=="loading" && session) return router.replace("dashboard")
  
  return router.replace("login")

}

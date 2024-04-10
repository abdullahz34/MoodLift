"use client";
import { useEffect } from "react";
import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";

export const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const { data: session } = useSession();
    useEffect(() => {
      if (!session) {
        redirect("/");
      }
    }, []);

    if (!session) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};
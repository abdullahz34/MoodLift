'use client'
import Link from "next/link";
import RemoveBtn from "./RemoveBtn.jsx";
import { HiPencilAlt, HiDotsHorizontal } from "react-icons/hi";
import React from 'react';
import { IoMenu } from "react-icons/io5";





const capitalFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getSurveys = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/surveys", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch surveys");
    }
    
    return res.json();
  } catch (error) {
    console.log("Error loading surveys: ", error);
  }
};

export default async function SurveyList() {
  
  const { surveys } = await getSurveys();
  

  return (
    <>
    <div className="pt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {surveys.map((s) => (
        
        <div
          key={s._id}
          className="card shadow-xl bg-primary border-secondary border-3"
        >
          <div className="card-body">
            <h2 className="card-title">{s.title}</h2>
            <h3 className="whitespace-nowrap overflow-hidden max-w-max text-m font-primary bg-secondary text-white px-2 py-1 rounded-md inline-block">
            {capitalFirst(s.frequency)}
</h3>
            <div className="card-actions justify-end">{s.description}</div>
          </div>
          
          <div className="  pt-3 absolute right-0 pr-3 ">
            <DropdownMenu id={s._id} />
          </div>
          

<Link className="btn btn-ghost text-lg text-bg-secondary font-bold" 
        href={`/completeSurvey/${s._id}`}
  >
            Complete Survey
          </Link>

        </div>
      
      ))}
      </div>
    </>
  );
}

const DropdownMenu = ({ id }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownRef = React.useRef(null);

    
   
  
};
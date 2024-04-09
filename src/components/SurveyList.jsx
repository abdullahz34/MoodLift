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
          className="card shadow-xl bg-neutral-content border-secondary border-3"
        >
          <div className="card-body">
            <h2 className="card-title">{s.title}</h2>
            <h3
              className={`whitespace-nowrap overflow-hidden max-w-max text-m font-primary px-2 py-1 rounded-md inline-block ${
                s.frequency === 'daily'
                  ? 'bg-secondary text-black'
                  : s.frequency === 'weekly'
                  ? 'bg-green-500 text-black'
                  : s.frequency === 'monthly'
                  ? 'bg-yellow-500 text-black'
                  : ''
              }`}
>
              {capitalFirst(s.frequency)}
              </h3>

              <div>
          <span
          className={`text-sm font-primary px-2 py-1 rounded-md ${
            s.frequency === 'daily'
              ? 'bg-secondary text-black'
              : s.frequency === 'weekly'
              ? 'bg-green-500 text-black'
              : s.frequency === 'monthly'
              ? 'bg-yellow-500 text-black'
              : ''
          }`}
        >
          {s.frequency === 'daily'
            ? 'Due today'
            : s.frequency === 'weekly'
            ? 'Due in 6 days'
            : s.frequency === 'monthly'
            ? 'Due in 29 days'
            : ''}
        </span>
        </div>



            <div className="card-actions justify-end">{s.description}</div>
          </div>
          
          <div className="  pt-3 absolute right-0 pr-3 ">
            <DropdownMenu id={s._id} />
          </div>
          

<Link className="btn btn-ghost text-lg text-bg-secondary font-bold" 
        href={`/completeSurvey/${s._id}`}
  >
            View Survey
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

  return (
    
    <div className="relative" ref={dropdownRef}>
      
      <button
        onClick={toggleDropdown}
        className="text-gray-500 hover:text-gray-700 focus:outline-none w-38"
      >
        <IoMenu size={30} />
        
      </button>
      

      {isOpen && (
        <div className="absolute right-0 mt-1 py-2 w-42 bg-white rounded-md shadow-lg z-10">
          <Link
            href={`/editSurvey/${id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HiPencilAlt size={18} className="inline-block mr-2" />
            Edit
          </Link>   
          <div className="block pl-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <RemoveBtn id={id} className="inline-block pl-2" />Delete
          </div>
        </div>
      )}
    </div>
  );
};
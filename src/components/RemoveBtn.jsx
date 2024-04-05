"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveBtn({ id }) {
  const router = useRouter();
  const removeSurvey = async () => {
    const confirmed = confirm("Delete this active survey?");

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/surveys?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <button onClick={removeSurvey} className="text-error">
      <HiOutlineTrash size={24} className="mr-1" />
    </button>
  );
}
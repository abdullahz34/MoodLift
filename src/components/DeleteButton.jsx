"use client";
import {useRouter} from "next/navigation";

export default function DeleteButton({id, route}){
    const router = useRouter();
    const handleDelete = async () =>  {
        const res = await fetch(`http://localhost:3000/api/${route}?id=${id}`, {
          method: "DELETE",
        });
      
        if (res.ok) {
          router.refresh();
        }
    }
    return(
        <button onClick={() => {handleDelete()}} className="btn">Delete</button>
    )
}
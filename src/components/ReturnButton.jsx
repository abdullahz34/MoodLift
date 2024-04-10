"use client";
import {useRouter} from "next/navigation";

export default function ReturnButton(){
    const router = useRouter();

    return(
      <button className="btn" onClick={() => router.back()}>Return </button>
    )
}
'use client';
import { FC, useState , useEffect } from "react"

interface indexProps{};

const index: FC<indexProps> = ({}) => {
    return(

        <div className="flex flex-col backdrop-blur-sm bg-slate-500/5  rounded-3xl h-full w-96 p-10">
            <details className="dropdown">
            <summary className="m-1 btn">Ambassadors</summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
            </ul>
            </details>
        </div>
    )
}

export default index;
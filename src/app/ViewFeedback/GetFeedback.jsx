import { Underdog } from 'next/font/google';
import React from 'react';
const getFeedback = async() => {
    try {
        const res = await fetch("http://localhost:3000/api/feedback", {
            cache: "no-store", 
        });
        if (!res.ok) {
            throw new Error("Failed to fetch feedback");
        }
        return res.json();
    } catch (error) {
        console.log("Error loading feedback: ", error);
    }
}


const feedbackList = []
//Returns the list of feedback as an array with 10 entries
async function GetList() {
const allFeedback = await getFeedback();
let count = 0;
allFeedback.forEach(f => {

    let d = new Date(f.createdAt);
feedbackList.push([d.toLocaleDateString() + " " + d.toLocaleTimeString(), f.username, f.message])

count = count + 1;
});
}


export default async function DisplayEntries() {
    await GetList();
    return (
        <div>
        <IterateArray/>
        </div>
    )
}

function IterateArray() {
    if(feedbackList.length === 1) {
    return (
            <div>
            <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-secondary"><GetOutput/></div>
            </div>
            <br></br>
            <div>
            </div>
            </div>
    ) 
    }
    return (
    <div>
        <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-secondary"><GetOutput/></div>
        </div>
        <br></br>
        <div><IterateArray/></div>

    </div>
    )
}

function GetOutput() {
    let entry = feedbackList.splice(0,1)[0]
    let output = ""
    if (entry[1] === "" || entry[1] === undefined) {
        output = "["+entry[0] + "] " + entry[2]
    }
    else {output = "["+entry[0] + "] " + entry[2] + " (by " + entry[1] + ")"}
    return (output)

}


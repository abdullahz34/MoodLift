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
if (count > 10) {  }
else {
    let d = new Date(f.createdAt);
feedbackList.push([d.toLocaleDateString() + " " + d.toLocaleTimeString(), f.message])
}
count = count + 1;
});
}

//Returns the first entry of the feedback array and then removes it from the array
 function PopFirstEntry() {
    if (feedbackList.length ===  0) {
        return null
    }
    let entry = feedbackList[0];
    feedbackList.splice(0,1)
    return ("["+entry[0] + "] " + entry[1])

};

//Places the current entry of the feedback array into a speech bubble
function FormatEntry() {
    if (feedbackList.length === 0) {
        return
        (            
         <div className="badge badge-primary badge-lg"></div>
        )
    }
    else {
        return (
            <div>
            <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-secondary"><PopFirstEntry/></div>
            </div>
            <br></br>
            <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-primary"></div>
            </div>
            </div>
        )
    }
}


//Displays all of the speech bubbles containing the entries of feedback
export default async function DisplayEntries() {
    await GetList();
    return (
        <div>
            <div className="badge badge-primary badge-lg"></div> 
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
            <FormatEntry/>              
        </div>
    )
}


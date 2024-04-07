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

export default async function AllFeedback() {
    let  feedbackList = []
    const allFeedback = await getFeedback();
    let count = [0];
    allFeedback.forEach(f => {
        if (count > 10) {  }
        else {
        feedbackList.push("DATE: " + f.updatedAt + " MESSAGE: "+ f.message + ", " + "\n")
        }
        count = count + 1

    });
    
    return (
        feedbackList)
};


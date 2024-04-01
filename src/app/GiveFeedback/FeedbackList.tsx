async function getFeedback(){
    const res = await fetch('http://localhost:3000/Feedback')
    return res.json()
}


export default async function FeedbackList(){
    const tickets = await getFeedback()
    return (
        <div>TicketList</div>
    )
}
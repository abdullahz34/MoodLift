'use client';
import React, { FC, useEffect, useState } from "react";
import {format} from 'date-fns';
import Alert from '@/components/Alert/index'

interface Request { 
    Ambassador_username:string,
    Employee_username:string,
    Severity:string,
    Reason:string, 
    Appointment_Preference:string
}


const RequestList: FC = () => {

    const [requests, setRequests] = useState<Request[]>([]);
    const [showAlert, setShowAlert] = useState(false);// alert
    const [Message,SetMessage]=useState('')


    const fetchRequests = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/AmbassadorRequest");
          if (!response.ok) {
            throw new Error("Failed to fetch requests");
          }
          const requests = await response.json();
          
          return requests;
          
        } catch (error) {
          console.error("Error fetching appointments:", error);
          throw error;
        }
    }

    const deleteRequest = async (Request: any,button:String) => {
        try {
          const response = await fetch('/api/AmbassadorRequest', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Request),
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete Request');
          }
      
          const data = await response.json();
          console.log(data.message);
          // update the state by filtering out the deleted request

          const alertMessage = `Request has been ${button} successfully.`;
          SetMessage(alertMessage)

          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 5000);

          setRequests(requests.filter((a) => a !== Request));
        } catch (error) {
          console.error('Error deleting Request:', error);
        }
      };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };


    useEffect(() => {
        const fetchData = async () => {
          try {
            const requestsData = await fetchRequests();
            setRequests(requestsData);
            console.log(requests)
          } catch (error) {
            console.error("Error fetching requests:", error);
          }
        };
    
        fetchData();
      }, []);



    return (
        <div className=" backdrop-blur-sm bg-slate-500/5 rounded-3xl p-5 h-full ">
        {showAlert && (
          <Alert message={Message} onClose={handleCloseAlert} />
        )}
        {requests.length > 0 ? (
            <table className="table">
                <thead>
                <tr className="bg-base-200">
                    <th></th>
                    <th>Employee</th>
                    <th>Severity</th>
                    <th>Appointment Preference</th>
                    <th>Reason</th>
                    <th>Cancel</th>
                    <th>Approve</th>
                </tr>
                </thead>
                <tbody>
                {requests.map((request, index) => (
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td className="pr-2">{request.Employee_username}</td>
                        <td>{request.Severity}</td>
                        <td>{request.Appointment_Preference}</td>
                        {/* <td>{request.Reason}</td> */}
                        <td>
                            {/* Open the modal using document.getElementById('ID').showModal() method */}
                            {/* <button className="btn" onClick={()=>document.getElementById('my_modal_2').showModal()}>Reason</button> */}
                            <button className="btn" onClick={() => (document.getElementById('my_modal_2') as HTMLDialogElement)?.showModal()}>Reason</button>
                            <dialog id="my_modal_2" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Reason</h3>
                                    <textarea className="text-pretty textarea textarea-ghost w-full" readOnly>{request.Reason}</textarea>
                                </div>
                                <form method="dialog" className="modal-backdrop pt-10">
                                    <button>close</button>
                                </form>
                            </dialog>
                        </td>
                        <td><button className="btn btn-sm btn-error" onClick={() => deleteRequest(request,"cancelled")}>Cancel</button></td>
                        <td><button className="btn btn-sm btn-success" onClick={() => deleteRequest(request,"Approved")}>Approve</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        ):(
            <div className="flex items-center justify-center h-3/6 text-2xl font-bold text-gray-800">No Incoming Requests</div>
        )}
        </div>
    );
};

export default RequestList;
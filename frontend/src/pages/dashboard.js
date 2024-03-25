import React, {useEffect, useState} from 'react';
import AdminDash from "./dash/AdminDash";
import AmbassadorDash from "./dash/AmbassadorDash";
import EmployeeDash from "./dash/EmployeeDash";
import { useLocation } from 'react-router-dom';

function Dashboard() {
const location = useLocation();
const {userType} = location.state;
  
  return (
    <>
      <h1>Welcome to the dashboard!</h1>
      <h2>userType: {userType}</h2>
      {userType === 'admin' && <AdminDash/>}
      {userType === 'ambassador' && <AmbassadorDash/>}
      {userType === 'employee' && <EmployeeDash/>}
    </>
  );
}

export default Dashboard;
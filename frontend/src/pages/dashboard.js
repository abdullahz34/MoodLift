import React, {useEffect, useState} from 'react';
import AdminDash from "./dash/AdminDash";
import AmbassadorDash from "./dash/AmbassadorDash";
import EmployeeDash from "./dash/EmployeeDash";

function Dashboard() {
  const userType = 'admin'
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
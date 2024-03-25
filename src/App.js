import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AdminDash from './pages/dash/AdminDash';
import AmbassadorDash from './pages/dash/AmbassadorDash';
import EmployeeDash from './pages/dash/EmployeeDash';
import Unknown from './pages/unknown';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="admin" element={<AdminDash/>}/>
          <Route path="ambassador" element={<AmbassadorDash/>}/>
          <Route path="employee" element={<EmployeeDash/>}/>
          </Route> 
        <Route path="*" element={<Unknown/>}/>
      </Routes>
    </>
  );
}

export default App;

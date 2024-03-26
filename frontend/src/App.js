import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import Nav from './components/Nav';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Unknown from './pages/unknown';

function App() {
  const {user} = useAuthContext()
  return (
    <>
      <Nav />
      <Routes>
        <Route 
          path="/" 
          element={user ? <Dashboard/> : <Navigate to="/login"/>}
        />
        <Route 
          path="/login" 
          element={!user ? <Login/> : <Navigate to="/"/>}
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup/> : <Navigate to="/"/>}
        />
        <Route 
          path="*" 
          element={<Unknown/>}
        />
      </Routes>
    </>
  );
}

export default App;

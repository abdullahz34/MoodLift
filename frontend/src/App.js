import { Routes, Route, Link } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Unknown from './pages/unknown';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="*" element={<Unknown/>}/>
      </Routes>
    </>
  );
}

export default App;

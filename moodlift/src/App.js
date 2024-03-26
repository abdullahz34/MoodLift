import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { CreateRecipe } from "./pages/create-recipe.js";
import { ViewRecipe } from "./pages/view-recipe.js";
import { Navbar } from './components/navbar.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<CreateRecipe/>} />
          <Route path="/view-recipe" element={<ViewRecipe />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

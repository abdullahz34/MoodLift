import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { CreateRecipe } from "./pages/create-recipe.js";
import { ViewRecipe } from "./pages/view-recipe.js";
import { EditRecipe } from "./pages/edit-recipe.js";
import { Navbar } from './components/navbar.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<CreateRecipe/>} />
          <Route path="/view-recipe" element={<ViewRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import { Link } from "react-router-dom";

export const Navbar = () => {
    return(
        <div className="navbar">
            <Link to="/">Create Recipe</Link>
            <Link to="/view-recipe">View Recipe</Link>
        </div>
    )
}
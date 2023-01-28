import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import useDarkMode from "../hooks/useDarkMode";
const Navbar = () => {
  const { userEmail } = useAuthState();
  const [theme, toggleTheme] = useDarkMode()
  return (
    <div className="container-fluid d-flex justify-content-between px-2 py-2 ">
      <div className="d-flex align-items-center">
        <nav className="px-1 ">
          <Link className="text-decoration-none px-1  fw-bold navbar-link" to="/" >
            ReactCoin
          </Link>
          <Link className="text-decoration-none px-1  fw-bold navbar-link" to="/Trade/btc" >
            Trade
          </Link>
          <Link className="text-decoration-none px-1  fw-bold navbar-link" to="/Swap/btc" >
            Swap
          </Link>
        </nav>
      </div>
      <div className="d-flex align-items-center px-1">
        <div className="d-flex">
          <button type="button" onClick={toggleTheme} className="border border-0 dark-switch">
            <svg className="moon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
              <defs></defs>
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </button>
          {userEmail ?
            <div className="me-auto mb-2  my-2">
              <Link to="/Dashboard" className="text-decoration-none px-1  fw-bold navbar-link" >
                Dashboard
              </Link>
            </div>
            :
            <Link to="/Login" className="text-decoration-none px-1  fw-bold navbar-link" type="submit" >
              Login
            </Link>
          }
        </div>
      </div>
    </div>
  );
};
export default Navbar;

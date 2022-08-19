import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuthState();
  return (
    <nav className=" ">
      <div className="container-fluid   d-flex justify-content-between p-2 ">
        <div className="d-flex align-items-center">
          <nav className="px-2 ">
            <Link className="text-decoration-none px-3 text-dark fw-bold" to="/">
            ReactCoin
            </Link>
            {user ? (
              <>
                <Link className="text-decoration-none px-3 text-dark fw-bold " to="/trade/btc">
                  Trade
                </Link>
                <Link className="text-decoration-none px-3 text-dark fw-bold" to="/buyfast/btc">
                  Buy Now
                </Link>
              </>
            ) : (
              <></>
            )}
          </nav>
        </div>
        <div className="d-flex align-items-center px-1">
          <ul className="navbar-nav me-auto mb-2  my-2">
            {user ? (
              <Link
                to="/dashboard"
                className="nav-item mx-2 text-decoration-none text-dark fw-bold"
              >
                Dashboard
              </Link>
            ) : (
              <></>
            )}
          </ul>
          <div className="d-flex">
            {user ? null : (
              <Link
                to="/login"
                className="nav-item mx-2 text-decoration-none text-dark fw-bold"
                type="submit"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

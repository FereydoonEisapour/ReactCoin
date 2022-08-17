import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuthState();
  return (
    <nav className="navbar  ">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <nav className="px-3 ">
            <Link className="text-decoration-none px-3" to="/">
              Crypto
            </Link>
            {user ? (
              <>
                <Link className="text-decoration-none px-3" to="/coin/trading/btc">
                  Trade
                </Link>
                <Link className="text-decoration-none px-3" to="/coin/buyfast/btc">
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
              <Link to="/dashboard" className="nav-item mx-2 text-decoration-none">
                Dashboard
              </Link>
            ) : (
              <></>
            )}
          </ul>
          <div className="d-flex">
            {user ? null : (
              <Link to="/login" className="nav-item mx-2 text-decoration-none" type="submit">
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

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg  ">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <div className="display-6">
            <Link className="text-decoration-none" to="/">
              Crypto
            </Link >
          </div>
          <div className=" mx-3 h4 mt-2">
            <Link className="text-decoration-none" to="/coin/trading/btc">Trade</Link>
          </div>
        </div>

        <div className="d-flex align-items-center px-1">
          <ul className="navbar-nav me-auto mb-2  my-2">
            <li className="nav-item mx-2">Dashboard</li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-success" type="submit">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

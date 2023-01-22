import { Link } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import { changeTheme, useThemeDispatch, useThemeState } from "../contexts/ThemeContext";

const Navbar = () => {
  const { userEmail } = useAuthState();
  const { theme } = useThemeState()
  const dispatch = useThemeDispatch()

  const changeThemeButton = () => {
    changeTheme(dispatch, theme)
  }
  console.log(theme)
  return (
    <div className={`container-fluid d-flex justify-content-between px-2 py-2 ${theme === 'dark' ? "dark" : "light"}`}>
      <div className="d-flex align-items-center">
        <button onClick={changeThemeButton}>theme</button>
        <nav className="px-1 ">
          <Link
            className="text-decoration-none px-1 text-dark fw-bold  "
            to="/"
          >
            ReactCoin
          </Link>

          <>
            <Link
              className="text-decoration-none  px-1 text-dark fw-bold "
              to="/trade/btc"
            >
              Trade
            </Link>
            <Link
              className="text-decoration-none px-1 text-dark fw-bold"
              to="/buyfast/btc"
            >
              Buy Now
            </Link>
          </>
        </nav>
      </div>
      <div className="d-flex align-items-center px-1">
        {/* <ul className="navbar-nav me-auto mb-2  my-2">
          <Link
            to="/dashboard"
            className="nav-item mx-1 text-decoration-none text-dark fw-bold"
          >
            Dashboard
          </Link>

          <></>
        </ul> */}
        <div className="d-flex">
          {userEmail ? (
            <div className="me-auto mb-2  my-2">
              <Link
                to="/dashboard"
                className="nav-item mx-1 text-decoration-none text-dark fw-bold"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="nav-item mx-1 text-decoration-none text-dark fw-bold"
              type="submit"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>

    // <div className="container-fluid d-flex justify-content-between px-2 py-2 ">
    //   <div className="d-flex align-items-center">
    //     <nav className="px-1 ">
    //       <Link className="text-decoration-none px-1 text-dark fw-bold  " to="/">
    //         ReactCoin
    //       </Link>
    //       {user ? (
    //         <>
    //           <Link className="text-decoration-none  px-1 text-dark fw-bold " to="/trade/btc">
    //             Trade
    //           </Link>
    //           <Link className="text-decoration-none px-1 text-dark fw-bold" to="/buyfast/btc">
    //             Buy Now
    //           </Link>
    //         </>
    //       ) : (
    //         <></>
    //       )}
    //     </nav>
    //   </div>
    //   <div className="d-flex align-items-center px-1">
    //     <ul className="navbar-nav me-auto mb-2  my-2">
    //       {user ? (
    //         <Link
    //           to="/dashboard"
    //           className="nav-item mx-1 text-decoration-none text-dark fw-bold"
    //         >
    //           Dashboard
    //         </Link>
    //       ) : (
    //         <></>
    //       )}
    //     </ul>
    //     <div className="d-flex">
    //       {user ? null : (
    //         <Link
    //           to="/login"
    //           className="nav-item mx-1 text-decoration-none text-dark fw-bold"
    //           type="submit"
    //         >
    //           Login
    //         </Link>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};
export default Navbar;

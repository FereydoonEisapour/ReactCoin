import { Link } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import { changeTheme, useThemeDispatch, useThemeState } from "../contexts/ThemeContext";
import sun from './../assets/pic/sun.svg'
import moon from './../assets/pic/moon.png'
const Navbar = () => {
  const { userEmail } = useAuthState();
  const { theme } = useThemeState()
  const dispatch = useThemeDispatch()

  const changeThemeButton = () => {
    changeTheme(dispatch, theme)
  }
  console.log(theme)
  return (
    <div className={`container-fluid d-flex justify-content-between px-2 py-2 
    ${theme === 'dark' ? "bgDark textLight" : " bgLight textDark "}`
    }>
      <div className="d-flex align-items-center">

        <nav className="px-1 ">
          <Link
            className={`text-decoration-none px-1  fw-bold 
            ${theme === 'dark' ? " textLight" : " textDark"}
            `}
            to="/"
          >
            ReactCoin
          </Link>

          <>
            <Link
              className={`text-decoration-none px-1  fw-bold 
                 ${theme === 'dark' ? " textLight" : " textDark"}
                 `}
              to="/trade/btc"
            >
              Trade
            </Link>
            <Link
              className={`text-decoration-none px-1  fw-bold 
                ${theme === 'dark' ? " textLight" : " textDark"}
                `}
              to="/buyfast/btc"
            >
              Buy Now
            </Link>
          </>
        </nav>
      </div>
      <div className="d-flex align-items-center px-1">
        <div className="d-flex">
          <button onClick={changeThemeButton} className="border border-0 ">
            {theme === 'dark' ?

              <svg
                className="sun"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="38/8"
                viewBox="0 0 24 24"
              >
                <path className="center" d="M12,7a5,5,0,1,0,5,5,5,5,0,0,0-5-5Z" />
                <path className="left" d="M2,13H4a1,1,0,0,0,0-2H2a1,1,0,0,0,0,2Z" />
                <path className="right" d="M20,13h2a1,1,0,0,0,0-2H20a1,1,0,0,0,0,2Z" />
                <path className="top" d="M11,2V4a1,1,0,0,0,2,0V2a1,1,0,0,0-2,0Z" />
                <path className="bottom" d="M11,20v2a1,1,0,0,0,2,0V20a1,1,0,0,0-2,0Z" />
                <path
                  className="top-left"
                  d="M6,4.58A1,1,0,0,0,4.58,6L5.64,7.05A1,1,0,0,0,7.05,5.64Z"
                />
                <path
                  className="bottom-right"
                  d="M18.36,17A1,1,0,0,0,17,18.36L18,19.42A1,1,0,1,0,19.42,18Z"
                />
                <path
                  className="top-right"
                  d="M19.42,6A1,1,0,1,0,18,4.58L17,5.64a1,1,0,0,0,1.41,1.41Z"
                />
                <path
                  className="bottom-left"
                  d="M7.05,18.36A1,1,0,0,0,5.64,17L4.58,18A1,1,0,1,0,6,19.42Z"
                />
              </svg>
              : <svg
                className="moon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  className="center"
                  d="M11,3.05A9,9,0,1,0,21,13a1,1,0,0,0-1.54-.95,5.4,5.4,0,0,1-7.47-7.44A1,1,0,0,0,11,3.05Z"
                />
              </svg>}
          </button>
          {userEmail ? (
            <div className="me-auto mb-2  my-2">
              <Link
                to="/dashboard"
                className={`text-decoration-none px-1  fw-bold 
            ${theme === 'dark' ? " textLight" : " textDark"}
            `}
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-decoration-none px-1  fw-bold 
            ${theme === 'dark' ? " textLight" : " textDark"}
            `}
              type="submit"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;

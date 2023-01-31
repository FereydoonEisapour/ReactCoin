import { Link } from "react-router-dom";

const PleaseLogin = () => {
  return <div className=" text-center mx-auto fw-bold">
    <Link to="/Login" className="text-decoration-none navbar-link text-color ">Please Login</Link>
  </div>;
}

export default PleaseLogin;

import logo from "../../assets/logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { FaCrown } from "react-icons/fa6";

const LogoBar = () => {
  const linkStyle = {
    textDecoration: "none",
    color: "#FFFF",
  };

  return (
    <div className="text-center mb-3 mt-1">
      <Link className="navbar-brand" to="/">
        <img
          className="logo mt-2"
          style={{ width: "7rem" }}
          src={logo}
          alt="logo"
        />
      </Link>
    </div>
  );
};

export default LogoBar;

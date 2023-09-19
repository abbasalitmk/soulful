import "./Sidebar.css";
import logo from "../../../assets/logo.png";
import { FaUserGroup, FaRegImages, FaRectangleList } from "react-icons/fa6";

const Sidebar = () => {
  const linkStyle = {
    cursor: "pointer",
  };

  return (
    <>
      <div className="col-md-3 db-sidebar-container">
        <div className="db-sidebar-logo mx-auto mb-3">
          <img className="" src={logo} alt="" />
        </div>
        <ul className="db-sidebar-menu" style={linkStyle}>
          <li>
            <FaUserGroup className="me-3" size={"1.1em"} />
            User Management
          </li>
          <li>
            <FaRegImages className="me-3" size={"1.1em"} />
            Content Management
          </li>
          <li>
            <FaRectangleList className="me-3" size={"1.1em"} />
            Activity Management
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

import logo from "../../assets/logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { FaCrown, FaBell, FaPowerOff } from "react-icons/fa6";
import { Modal, Button } from "react-bootstrap";
import { useContext, useState } from "react";
import Notification from "../Notification/Notification";
import WebsocketContext from "../../context/WebsocketContext";

const Navbar = ({ show, onHide }) => {
  const { notification } = useContext(WebsocketContext);
  const [showModal, setShowModal] = useState(false);
  const linkStyle = {
    textDecoration: "none",
    color: "#FFFF",
  };

  return (
    <div className="container-fluid mb-5">
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Notification />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <Link className="navbar-brand d-lg-none d-xl-none" to="/">
          <img className="logo" src={logo} alt="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse bg-dark" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" style={linkStyle} to="/match">
                Match
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={linkStyle} to="/posts">
                Posts
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={linkStyle} to="/meet">
                <FaCrown
                  size={"1.1em"}
                  className="me-1 mb-1"
                  style={{ color: "#ffca0a" }}
                />
                Meet
              </Link>
            </li>
            <li className="d-none d-lg-block d-xl-block mt-1">
              <Link className="navbar-brand" to="/">
                <img className="logo" src={logo} alt="logo" />
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" style={linkStyle} to="/profile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  notification.length > 0
                    ? "nav-link text-warning"
                    : "nav-link text-white"
                }
                style={linkStyle}
                onClick={() => setShowModal(true)}
              >
                <FaBell />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={{ color: "red", textDecoration: "none" }}
                to="/logout"
              >
                <FaPowerOff size={"1.2em"} />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

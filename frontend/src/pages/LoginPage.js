import { Fragment } from "react";
import Login from "../components/Login/Login";
import Navbar from "../components/Navbar/Navbar";
import LogoBar from "../components/Navbar/LogoBar";

const LoginPage = () => {
  return (
    <Fragment>
      <LogoBar />
      <Login />
    </Fragment>
  );
};
export default LoginPage;

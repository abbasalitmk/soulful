import { Fragment } from "react";
import Navbar from "../components/Navbar/Navbar";
import Register from "../components/Register/Registere";
import LogoBar from "../components/Navbar/LogoBar";

const RegisterPage = () => {
  return (
    <Fragment>
      <LogoBar />
      <Register />
    </Fragment>
  );
};
export default RegisterPage;

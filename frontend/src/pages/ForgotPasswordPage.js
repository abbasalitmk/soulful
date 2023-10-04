import { Fragment } from "react";
import Navbar from "../components/Navbar/Navbar";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import LogoBar from "../components/Navbar/LogoBar";

const ForgotPasswordPage = () => {
  return (
    <Fragment>
      <LogoBar />
      <ForgotPassword />
    </Fragment>
  );
};
export default ForgotPasswordPage;

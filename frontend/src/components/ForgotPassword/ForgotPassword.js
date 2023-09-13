import { Fragment } from "react";
import ForgotImage from "../../assets/forgot.png";

const ForgotPassword = () => {
  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">
            <img src={ForgotImage} alt="forgot password" width={"100%"} />
          </div>
          <div className="col-md-6 p-5">
            <div class="mb-3 m-5">
              <label for="" class="form-label">
                Email
              </label>
              <input
                type="text"
                class="form-control"
                name="email"
                id=""
                placeholder="Enter your email address"
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-success"></button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;

import React from "react";
import { useState } from "react";
import "./Subscription.css";
import { Modal, Button, Nav } from "react-bootstrap";
import AxiosInstance from "../../AxiosInstance";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";

const Subscription = () => {
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const amount = 10000;

  const Axios = AxiosInstance();

  const handlePayment = async () => {
    if (!orderId) {
      try {
        const response = await Axios.post("subscription/order/");
        if (response.status === 201) {
          setOrderId(response.data.order_id);
        }
      } catch (error) {
        console.log(error.response);
      }
    }

    if (orderId) {
      // Open the Razorpay payment interface using the orderId
      const options = {
        key: process.env.RAZORPAY_API_KEY,
        amount: amount,
        currency: "INR",
        order_id: orderId,
        name: "Soulful",
        description: "Payment for subscription",

        theme: {
          color: "#F37254",
        },
        notes: {
          address: "aa",
        },
        handler: async (response) => {
          try {
            console.log(response);
            const res = await Axios.post("subscription/verify-payment/", {
              order_id: orderId,
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
            });

            if (res.status === 200) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                alert("dd");
              });
            }
          } catch (error) {
            console.log(error.response);
            Swal.fire({
              icon: "error",
              title: "Payment failed",
              text: error.response.data.message,

              timerProgressBar: true,
              showConfirmButton: true,
            }).then(() => {
              // Redirect to checkout page
            });
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
      rzp.on("payment.failed", function (response) {
        rzp.close();
        Swal.fire({
          icon: "error",
          title: "Payment failed",
          text: "Your payment could not be processed. Please try again.",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(function () {
          // Redirect to checkout page
          window.location.href = "{% url 'checkout' %}";
        });
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-12 col-sm-12 col-lg-12 col-md-12 d-flex justify-content-center"
            style={{ backgroundColor: "#dddddd" }}
          >
            <section
              className="price_plan_area section_padding_130_80 col-md-10 p-5"
              id="pricing"
            >
              <div
                className="section-heading text-center wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <h4>Upgrade for better match</h4>
                <div className="line"></div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div
                    className="single_price_plan active wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <div className="side-shape">
                      <img
                        src="https://bootdey.com/img/popular-pricing.png"
                        alt=""
                      />
                      .
                    </div>
                    <div className="title">
                      <span>Popular</span>
                      <h3>Premium</h3>
                      <div className="line"></div>
                    </div>
                    <div className="price">
                      <h4>Rs. 100/m</h4>
                    </div>
                    <div className="description">
                      <p>
                        <i className="lni lni-checkmark-circle"></i>Duration: 1
                        Month
                      </p>
                      <p>
                        <i className="lni lni-checkmark-circle"></i>All feature
                        of Basics
                      </p>
                      <p>
                        <i className="lni lni-checkmark-circle"></i>+ Video Call
                      </p>
                      <p>
                        <i className="lni lni-checkmark-circle"></i>+ Live Chat
                        Translation
                      </p>
                    </div>
                    <div className="button">
                      <button
                        className="btn btn-warning"
                        onClick={handlePayment}
                        href="#"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="single_price_plan wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <div className="title">
                      <h3>Basic</h3>

                      <div className="line"></div>
                    </div>
                    <div className="price">
                      <h4>Rs. 0</h4>
                    </div>
                    <div className="description">
                      <p>
                        <i className="lni lni-checkmark-circle"></i>Duration:
                        Unlimited
                      </p>
                      <p>
                        <i className="lni lni-checkmark-circle"></i>Unlimited
                        Connections
                      </p>
                      <p>
                        <i className="lni lni-close"></i>Unlimited Chat
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;

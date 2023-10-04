import React from "react";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Membership from "../../components/Dashboard/Membership";
import Navbar from "../../components/Dashboard/Navbar";

function SubscriptionPage() {
  return (
    <>
      <Sidebar />
      <Navbar heading="Subscribers" />
      <Membership />
    </>
  );
}

export default SubscriptionPage;

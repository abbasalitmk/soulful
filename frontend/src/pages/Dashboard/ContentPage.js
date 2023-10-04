import React from "react";
import { Fragment } from "react";
import Content from "../../components/Dashboard/Content";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Navbar from "../../components/Dashboard/Navbar";

function ContentPage() {
  return (
    <Fragment>
      <Sidebar />
      <Navbar heading="Post Management" />
      <Content />
    </Fragment>
  );
}

export default ContentPage;

import React from "react";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import UserManagement from "../../components/Dashboard/UserManagement";
import Navbar from "../../components/Dashboard/Navbar";

function UserPage() {
  return (
    <>
      <Sidebar />

      <UserManagement />
    </>
  );
}

export default UserPage;

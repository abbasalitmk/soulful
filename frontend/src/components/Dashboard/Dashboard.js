import "./Dashboard.css";
import Sidebar from "./Sidebar/Sidebar";
import UserManagement from "./UserManagement";
import Membership from "./Membership";

const Dashboard = () => {
  return (
    <>
      <div className="row">
        <Sidebar />
        <Membership />
      </div>
    </>
  );
};
export default Dashboard;

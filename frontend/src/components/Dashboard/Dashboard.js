import "./Dashboard.css";
import ContentManamentment from "./ContentManagement";
import Sidebar from "./Sidebar/Sidebar";
import UserManagement from "./UserManagement";

const Dashboard = () => {
  return (
    <>
      <div className="row">
        <Sidebar />
        <ContentManamentment />
      </div>
    </>
  );
};
export default Dashboard;

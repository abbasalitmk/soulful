import Profile from "../components/Profile/Profile";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Profile/Sidebar/Sidebar";

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <Sidebar />
          <Profile />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

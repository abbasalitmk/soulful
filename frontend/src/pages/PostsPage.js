import { Fragment } from "react";
import Posts from "../components/Posts/Posts";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

const PostsPage = () => {
  return (
    <Fragment>
      <Navbar />
      <div className="row" style={{ backgroundColor: "#f0f2f5" }}>
        <Sidebar />
        <Posts />
      </div>
    </Fragment>
  );
};
export default PostsPage;

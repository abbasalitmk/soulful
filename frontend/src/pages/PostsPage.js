import { Fragment } from "react";
import Posts from "../components/Posts/Posts";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Suggested from "../components/Sidebar/Suggested";

const PostsPage = () => {
  return (
    <Fragment>
      <Navbar />
      <div className="container">
        <div className="row">
          <Sidebar />
          <Posts />
          {/* <Suggested /> */}
        </div>
      </div>
    </Fragment>
  );
};
export default PostsPage;

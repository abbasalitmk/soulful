import { Fragment } from "react"
import Posts from "../components/Posts/Posts"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"


const PostsPage = () => {


    return (
        <Fragment>
            <Navbar />
            <div className="row">
                <Sidebar />
                <Posts />
            </div>
        </Fragment>


    )
}
export default PostsPage
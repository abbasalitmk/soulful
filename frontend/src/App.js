import { Fragment } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
// import { ToastContainer } from 'react-toastify';
import PrivateRoute from "./utils/PrivateRoute";
import VerifyEmail from "./utils/VerifyEmail";
import { Toaster } from "react-hot-toast";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Logout from "./utils/Logout";
import EditProfile from "./components/Register/EditProfile";
import ProfilePage from "./pages/ProfilePage";
import Match from "./components/Match/Match";
import ChatRoom from "./components/Chat/ChatRoom";
import Followers from "./components/Chat/Followers";
import ChatPage from "./pages/ChatPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Fragment>
      <Toaster position="top-right" reverseOrder={false} />
      {/* <ToastContainer /> */}
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/followers" element={<Followers />} />

          <Route
            path="/email-verification"
            element={<EmailVerificationPage />}
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="/meet" element={<ChatPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/match" element={<Match />} />

            <Route path="/posts" element={<PostsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;

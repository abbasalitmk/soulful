import { Fragment, useState } from "react";
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
import ChatPage from "./pages/ChatPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Dashboard from "./components/Dashboard/Dashboard";
import Subscription from "./components/Subscription/Subscription";
import AdminRoute from "./utils/AdminRoute";
import ContentPage from "./pages/Dashboard/ContentPage";
import SubscriptionPage from "./pages/Dashboard/SubscriptionPage";
import UserPage from "./pages/Dashboard/UserPage";
import Notification from "./components/Notification/Notification";
import { WebsocketProvider } from "./context/WebsocketContext";
import PublicRoute from "./utils/PublicRoute";

function App() {
  return (
    <Fragment>
      <Toaster position="top-right" reverseOrder={false} />
      {/* <ToastContainer /> */}
      <Router>
        <Routes>
          {/* redirect to post page if user is isAuthenticated */}
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Route>

          <Route
            path="/email-verification"
            element={<EmailVerificationPage />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/logout" element={<Logout />} />

          {/* prevent unauthorized access  */}
          <Route element={<PrivateRoute />}>
            <Route path="/meet" element={<ChatPage />} />

            <Route path="/subscription" element={<Subscription />} />
            <Route path="/match" element={<Match />} />

            <Route path="/posts" element={<PostsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/notification" element={<Notification />} />
          </Route>

          {/* prevent non admin access */}

          <Route element={<AdminRoute />}>
            <Route path="/dashboard/posts" element={<ContentPage />} />
            <Route path="/dashboard/users" element={<UserPage />} />
            <Route
              path="/dashboard/subscribers"
              element={<SubscriptionPage />}
            />
          </Route>
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;

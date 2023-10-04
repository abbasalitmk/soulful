import { useReducer } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};
export default AdminRoute;

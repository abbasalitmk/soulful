import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


const PrivateRoute = () => {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    return isAuthenticated ? (<Outlet />) : (<Navigate to='/login' />)

}
export default PrivateRoute
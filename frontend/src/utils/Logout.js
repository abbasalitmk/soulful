import { useDispatch, useSelector } from "react-redux"
import { clearToken } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { toast } from "react-hot-toast"

const Logout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(clearToken())
            toast.success('Logout successfully')
            navigate('/login')
        }
        else {
            navigate('/login')
        }
    })

}
export default Logout
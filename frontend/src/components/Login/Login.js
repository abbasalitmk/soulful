import './Login.css'
import background from '../../assets/login-background.png'
import { FaHandSpock } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUser } from '../../features/auth/authSlice'
import jwt_decode from "jwt-decode";






const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    // const token = useSelector((state) => (state.auth.token))

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                email, password
            })
            const token = response.data
            const user = jwt_decode(token.access)

            if (response.status === 200 && token) {
                dispatch(setToken(token))
                dispatch(setUser(user))
                localStorage.setItem('access', JSON.stringify(token))
                localStorage.setItem('user', JSON.stringify(user))

                navigate('/posts')
            }


        }
        catch (error) {
            if (error.response) {
                toast.error('Login failed. Please check your credentials.', { position: toast.POSITION.TOP_CENTER });
            }
        }
    }

    const updateToken = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            })
            console.log(response.data);
            // const token = response.data
            // const user = jwt_decode(token.access)

            // if (response.status === 200 && token) {
            //     dispatch(setToken(token))
            //     dispatch(setUser(user))
            //     localStorage.setItem('access', token)
            //     localStorage.setItem('user', JSON.stringify(user))
            //     navigate('/posts')
            // }

        }
        catch (error) {
            console.log(error);
            // if (error.response) {
            //     toast.error('Login failed. Please check your credentials.', { position: toast.POSITION.TOP_CENTER });
            // }
        }
    }

    setInterval(() => {
        updateToken()
        console.log('working');
    }, 5000);


    return (

        <div className='container mt-5'>
            <div className="row">
                <div className="col-md-6 col-sm-12 col-xs-12">
                    <img className='background' src={background} alt="" />
                </div>
                <div className="col-md-6 col-sm-12 col-xs-12 mx-auto">
                    <div className="login-container ">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <h4 className='text-center'>Welcome Back <FaHandSpock /></h4>

                            </div>
                            <div className="mb-4">
                                <div className="d-grid gap-2">
                                    <button type="button" name="" id="" className="btn google-login d-flex justify-content-evenly rounded-pill"><FcGoogle size='1.5em' />Signin with Google</button></div>
                            </div>

                            <div className="mb-3">
                                <label for="" className="form-label">Email</label>
                                <input onChange={(e) => setEmail(e.target.value)} type="email" name="" id="" className="form-control rounded-pill" placeholder="johndoe@gmail.com" aria-describedby="helpId" />
                            </div>
                            <div className="mb-3">
                                <label for="" className="form-label">Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control rounded-pill" name="" id="" placeholder="*********" />
                            </div>
                            <div className="mb-2 text-center">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>

                            <div className="mb-1 text-center">
                                <p className='text-center'>Don't have account? <Link to='/register'>Register</Link></p>
                                <Link to='/forgot-password' style={{ textDecoration: 'none' }}>Forgot Password</Link>
                            </div>

                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Login



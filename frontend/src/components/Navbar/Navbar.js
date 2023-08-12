import logo from '../../assets/logo.png'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {

    const linkStyle = {
        textDecoration: 'none',
        color: '#000'
    }

    return (
        <div className='navbar-container'>
            <div className='navbar'>
                <ul className='navbar-links'>
                    <li><Link style={linkStyle} to='/match'>Match</Link></li>
                    <li><Link style={linkStyle} to='/posts'>Posts</Link></li>
                    <li><img className='logo' src={logo} alt='logo'></img></li>
                    <li><Link style={linkStyle} to='/meet'>Meet</Link></li>
                    <li><Link style={linkStyle} to='/profile'>Profile</Link></li>
                </ul>

            </div>
        </div>
    )
}
export default Navbar
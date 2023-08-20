import './Sidebar.css'
import { BsFillHouseDoorFill, BsFillBellFill, BsMessenger, BsPersonLinesFill } from 'react-icons/bs'
import { FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'


const Sidebar = (props) => {
    const iconStyle = {
        marginRight: '1rem'
    }
    const linkStyle = {
        color: 'black',
        textDecoration: 'none'
    }

    return (
        <div className='col-3 sidebar-container'>
            <div className="">
                <ul>
                    <li><Link style={linkStyle}><BsFillHouseDoorFill style={iconStyle} />Home</Link></li>
                    <li><Link style={linkStyle}><BsFillBellFill style={iconStyle} />Notifications</Link></li>
                    <li><Link style={linkStyle}><BsMessenger style={iconStyle} />Messages</Link></li>
                    <li><Link style={linkStyle}><BsPersonLinesFill style={iconStyle} />Profile</Link></li>
                    <li><Link to='/logout' style={linkStyle}><FiLogOut style={iconStyle} />Logout</Link></li>
                </ul>
            </div >
        </div>
    )
}
export default Sidebar
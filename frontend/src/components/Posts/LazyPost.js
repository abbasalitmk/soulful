import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai'
import config from '../../config'
import 'react-toastify/dist/ReactToastify.css';

const LazyPost = ({ item }) => {

    const iconStyle = {
        color: '#000'
    }

    return (

        <div className="row mx-auto ">

            <div className="col post">
                <div className="mt-2 text-center">
                    <img className="post-image" src={`${config.apiUrl}${item.image && item.image.image}`} alt="beach" />
                </div>
                <div className="m-1">
                    <p className='text-center'>{item.title}</p>
                </div>
                <div className="m-1 d-flex justify-content-around border-bottom">
                    <li>{item.likes ? item.likes : 0} Likes</li>
                    <li>{item.comments ? item.comments : 0} Comments</li>
                    <li>{item.share ? item.comments : 0} Shares</li>
                </div>

                <div className="m-1 d-flex justify-content-around">
                    <li><Link><AiOutlineHeart size={'2em'} style={iconStyle} /></Link></li>
                    <li><Link><AiOutlineComment size={'2em'} style={iconStyle} /></Link></li>
                    <li><Link><AiOutlineShareAlt size={'2em'} style={iconStyle} /></Link></li>
                </div>
            </div>
        </div>
    )


}

export default LazyPost
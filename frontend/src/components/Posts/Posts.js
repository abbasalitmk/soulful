import './Posts.css'
import { FcCamera } from 'react-icons/fc'
import beach from '../../assets/posts/beach.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'





const Posts = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const user = useSelector((state) => state.auth.user)



    const iconStyle = {
        color: '#000'
    }

    return (
        <div className="col-md-6 offset-md-3 posts-container">
            <div className='new-post'>
                <div class="mb-2 mt-3">
                    <textarea placeholder="What's on your mind?" class="new-post-form form-control" id="" rows="3"></textarea>
                </div>

                <div class="input-group mb-3 d-flex justify-content-center">

                    <input class="form-control" type="file" id="file" style={{ display: "none" }} />
                    <label for="file"><li className='me-2 btn btn-dark'><FcCamera size={'2em'} /> Photo / Video</li></label>

                    <button class="btn btn-dark rounded" type="button" id="button-addon2">Post</button>
                </div>
            </div>

            {/* single post */}
            <div className="row mx-auto ">
                <div className="col post">
                    <div className="mt-2 text-center">
                        <img className="post-image" src={beach} alt="beach" />
                    </div>
                    <div className="m-1">
                        <p>Kozhikode beach vibes with friends</p>
                    </div>
                    <div className="m-1 d-flex justify-content-around border-bottom">
                        <li>10 Likes</li>
                        <li>10 Comments</li>
                        <li>5 Shares</li>
                    </div>

                    <div className="m-1 d-flex justify-content-around">
                        <li><Link><AiOutlineHeart size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineComment size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineShareAlt size={'2em'} style={iconStyle} /></Link></li>
                    </div>
                </div>
            </div>

            <div className="row mx-auto ">
                <div className="col post">
                    <div className="mt-2 text-center">
                        <img className="post-image" src={beach} alt="beach" />
                    </div>
                    <div className="m-1">
                        <p>Kozhikode beach vibes with friends</p>
                    </div>
                    <div className="m-1 d-flex justify-content-around border-bottom">
                        <li>10 Likes</li>
                        <li>10 Comments</li>
                        <li>5 Shares</li>
                    </div>

                    <div className="m-1 d-flex justify-content-around">
                        <li><Link><AiOutlineHeart size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineComment size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineShareAlt size={'2em'} style={iconStyle} /></Link></li>
                    </div>
                </div>
            </div>

            <div className="row mx-auto ">
                <div className="col post">
                    <div className="mt-2 text-center">
                        <img className="post-image" src={beach} alt="beach" />
                    </div>
                    <div className="m-1">
                        <p>Kozhikode beach vibes with friends</p>
                    </div>
                    <div className="m-1 d-flex justify-content-around border-bottom">
                        <li>10 Likes</li>
                        <li>10 Comments</li>
                        <li>5 Shares</li>
                    </div>

                    <div className="m-1 d-flex justify-content-around">
                        <li><Link><AiOutlineHeart size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineComment size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineShareAlt size={'2em'} style={iconStyle} /></Link></li>
                    </div>
                </div>
            </div>

            <div className="row mx-auto ">
                <div className="col post">
                    <div className="mt-2 text-center">
                        <img className="post-image" src={beach} alt="beach" />
                    </div>
                    <div className="m-1">
                        <p>Kozhikode beach vibes with friends</p>
                    </div>
                    <div className="m-1 d-flex justify-content-around border-bottom">
                        <li>10 Likes</li>
                        <li>10 Comments</li>
                        <li>5 Shares</li>
                    </div>

                    <div className="m-1 d-flex justify-content-around">
                        <li><Link><AiOutlineHeart size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineComment size={'2em'} style={iconStyle} /></Link></li>
                        <li><Link><AiOutlineShareAlt size={'2em'} style={iconStyle} /></Link></li>
                    </div>
                </div>
            </div>
        </div >
    )

}
export default Posts
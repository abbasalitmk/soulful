import './Posts.css'
import { FcCamera } from 'react-icons/fc'
import { Link } from 'react-router-dom'
import { AiFillLike, AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai'
import { BiEdit, BiTrash, BiMenu } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../../config'
import { FallingLines } from 'react-loader-spinner'
import toast, { Toaster } from 'react-hot-toast';






const Posts = () => {

    const token = useSelector((state) => state.auth.token)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [title, setTitle] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [liked, setLiked] = useState([])



    const fetchData = async () => {
        console.log(token.access);
        try {
            setLoading(true)
            const response = await axios.get('http://127.0.0.1:8000/posts/', {
                headers: {
                    'Authorization': `Bearer ${token.access}`
                }
            });
            if (response.status === 200) {
                setData(response.data)
            }
            else {
                console.log('something went wrong!');
            }
        }
        catch (error) {
            console.log(error.response);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        toast('redndering.');

    }, [])


    const likeButonHandler = async (id) => {

        try {
            const responce = await axios.post(`http://127.0.0.1:8000/posts/like/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token.access}`
                }
            });
            if (responce.status === 200) {
                // toast.success('Liked successfully')
                setData(prevData => prevData.map(item => {
                    if (item.id === id) {
                        return { ...item, likes: item.likes + 1 };
                    }
                    return item;
                }));
            }
        }
        catch (error) {
            console.log(error.responce);
        }



    }
    const onImageSelected = (e) => {
        setImage(e.target.files[0])
        setImagePreview(URL.createObjectURL(e.target.files[0]))
    }

    const postSubmitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);


        try {
            setLoading(true)
            const post = await axios.post('http://127.0.0.1:8000/posts/create/', formData, {
                headers: {
                    'Authorization': `Bearer ${token.access}`,
                    'Content-Type': 'multipart/form-data'
                },

            })

            if (post.status === 201) {
                // toast.success('Post created successfully.', { position: toast.POSITION.TOP_CENTER });
                setTitle('')
                setImage(null)
                setImagePreview(null);
                fetchData()

            } else {
                // toast.error('something went wrong!')
            }
        }
        catch (error) {
            // toast.error('error')
        }
        finally {
            setLoading(false)
        }


    }

    const imagePreviewCancel = () => {
        setImagePreview(null)
        setImage(null)
        setTitle('')
    }

    const deletePost = async (id) => {
        try {
            setLoading(true)
            const response = await axios.post(`http://127.0.0.1:8000/posts/delete/${id}`)
            if (response.status === 200) {
                toast.success('Post deleted')
                fetchData()
            }
        }
        catch (error) {
            toast.error('Post not found !')
        }
        finally {
            setLoading(false)
        }

    }



    const iconStyle = {
        color: '#000',
        textDecoration: 'none'
    }

    return (
        <div className="col-md-6 offset-md-3">
            <div className='new-post'>
                <p className='text-center'>{loading ?
                    (<div>
                        <FallingLines
                            color="#4fa94d"
                            width="100"
                            visible={true}
                            ariaLabel='falling-lines-loading' />
                        <p>Loading posts...</p>
                    </div>)
                    : null
                }
                </p>
                <form onSubmit={postSubmitHandler} encType="multipart/form-data">
                    <div className='new-status-form'>
                        <div className="mb-2 mt-3 ">
                            <textarea onChange={(e) => setTitle(e.target.value)} value={title} placeholder="What's on your mind?" className="new-post-form form-control" id="" rows="2">
                            </textarea>
                            {imagePreview &&
                                <div className='d-flex justify-content-center align-items-center'>
                                    <img className='w-25' src={imagePreview} alt='preview'></img>
                                </div>
                            }

                        </div>

                        <div className="input-group mb-3 d-flex justify-content-center">

                            <input className="form-control" type="file" accept="image/" id="file" name='image' onChange={onImageSelected} style={{ display: "none" }} loading="lazy" />
                            <label for="file"><li className='me-2 btn btn-dark'><FcCamera size={'2em'} /> Photo / Video</li></label>
                            {imagePreview &&
                                <button onClick={imagePreviewCancel} button className="btn btn-danger rounded me-2" type="button" id="button-addon2">Cancel</button>
                            }
                            <button className="btn btn-success rounded" type="submit" id="button-addon2">Post</button>
                        </div>
                    </div>
                </form>
            </div >

            {/* single post */}
            {
                data.map((item, index) => {
                    return (
                        <div className="row mx-auto text-center">

                            <div className="col post">
                                <div className="mt-2">
                                    <div className='post-options'>


                                        <div className="dropdown">
                                            <button className="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                <BiMenu size={'1.6em'} />
                                            </button>
                                            <ul className="dropdown-menu" >

                                                <li className='dropdown-item' ><Link className='text-decoration-none'><BiEdit size={'1.3em'} className="me-2 " />Edit</Link></li>
                                                <Link onClick={() => deletePost(item.id)} className='dropdown-item text-decoration-none'> <BiTrash size={'1.3em'} className="me-2" />Delete</Link>
                                            </ul>
                                        </div>


                                    </div>
                                    <img className="post-image " src={`${config.apiUrl}${item.image && item.image.image}`} key={index} alt="beach" />
                                </div>
                                <div className="m-1">
                                    <p className='text-center post-description' key={index} >{item.title}</p>
                                </div>
                                <div className="d-flex justify-content-around">
                                    <li key={index} onClick={() => likeButonHandler(item.id)}><Link><AiFillLike size={'2em'} fill={liked ? 'red' : 'black'} style={iconStyle} /></Link></li>
                                    <li><Link><AiOutlineComment size={'2em'} style={iconStyle} /></Link></li>
                                    <li><Link><AiOutlineShareAlt size={'2em'} style={iconStyle} /></Link></li>
                                </div>
                                <div className="d-flex justify-content-around" key={index} >
                                    <li>{item.likes ? item.likes : 0} Likes</li>
                                    <li>{item.comments ? item.comments : 0} Comments</li>
                                    <li>{item.share ? item.comments : 0} Shares</li>
                                </div>


                            </div>
                        </div>
                    )
                })
            }

        </div >
    )

}
export default Posts
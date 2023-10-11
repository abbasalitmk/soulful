import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import config from "../../config";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const EditPost = (props) => {
  const postId = props.postId;
  const [title, setTitle] = useState(props.title);
  const [postImage, setPostImage] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [imagePreview, setImagePreview] = useState(
    props.image ? config.media_url + props.image.image : null
  );
  const [loading, setLoading] = useState(false);
  const Axios = AxiosInstance();
  const token = useSelector((state) => state.auth.token);

  const selectPostImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      setImagePreview(URL.createObjectURL(image));
      setPostImage(image);
    }
  };

  const updatePostHandler = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("id", postId);

    if (postImage) {
      formData.append("image", postImage);
    }

    try {
      setLoading(true);
      const post = await axios.put(
        `${config.baseUrl}/posts/create/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (post.status === 200) {
        toast.success("Post updated");
        props.fetchData();
        props.closeModal();
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Modal
        show={true}
        onHide={props.closeModal}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="mb-3">
            <label for="" class="form-label">
              Title
            </label>
            <textarea
              class="form-control form-control-lg"
              name=""
              id=""
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div class="mb-3">
            <label for="" class="form-label">
              Change Image
            </label>
            <input
              type="file"
              class="form-control"
              name=""
              id=""
              onChange={selectPostImage}
              placeholder=""
            />
          </div>

          <div className="mb-3">
            <div className="editpost-image text-center">
              <img
                src={imagePreview && imagePreview}
                alt="postImage"
                style={{ width: "30%" }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={updatePostHandler}
            className="btn btn-success"
            type="button"
            id=""
          >
            Update
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default EditPost;

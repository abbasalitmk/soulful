import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../Chat/ChatRoom.css";
import AxiosInstance from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const ChatRoom = () => {
  const [chatLog, setChatLog] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [followers, setFollowers] = useState(null);
  const axios = AxiosInstance();
  const navigate = useNavigate();
  const [recipienId, setRecipientId] = useState(null);
  const sender_id = user.user_id;

  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const chatSocket = new WebSocket(
      // `ws://127.0.0.1:8000/ws/chat/${chatRoomName ? chatRoomName : 19}/`
      `ws://127.0.0.1:8000/ws/chat/${sender_id}/${recipienId}/`
    );

    chatSocket.onopen = () => {
      console.log("WebSocket connected");
    };

    chatSocket.onmessage = (e) => {
      const { sender_id, recipient_id, message } = JSON.parse(e.data);
      setChatLog((prevLog) => [
        ...prevLog,
        { sender_id, recipient_id, message },
      ]);
    };

    chatSocket.onclose = () => {
      console.error("Chat socket closed unexpectedly");
    };

    setSocket(chatSocket);

    // Cleanup WebSocket when the component unmounts
    return () => {
      chatSocket.close();
    };
  }, [recipienId]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const userName = user && user.name;
    const message = messageInput;
    const recipient_id = recipienId;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          message,
          sender_id: userName,
          recipient_id: recipient_id,
        })
      );
    }

    setMessageInput("");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/chat/followers/");
      if (response.status === 200) {
        console.log(response.data);
        setFollowers(response.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chatHandler = (userId) => {
    setRecipientId(userId);
  };
  useEffect(() => {
    setChatLog([]);
  }, [recipienId]);

  return (
    <div className="col-md-12">
      <section style={{ backgroundColor: "#eee" }}>
        <div className="container py-3">
          <div className="row">
            <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
              <h5 className="font-weight-bold mb-3 text-center text-lg-start">
                Member
              </h5>
              <div className="card">
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    {followers &&
                      followers.length &&
                      followers.map((item) => (
                        <li
                          className="p-2"
                          key={item.id}
                          onClick={() => chatHandler(item.followed_user)}
                        >
                          <a
                            href="#!"
                            className="d-flex justify-content-between"
                          >
                            <div className="d-flex flex-row">
                              <img
                                src={`${config.media_url}${item.image}`}
                                alt="avatar"
                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong followers-avatar"
                              />
                              <div className="pt-1">
                                <p className="fw-bold mb-0 text-decoration-none">
                                  {item.name}
                                </p>
                                <p className="small text-muted">Available</p>
                              </div>
                            </div>
                            <div className="pt-1">
                              <p className="small text-muted mb-1">
                                5 mins ago
                              </p>
                              <span className="text-muted float-end">
                                <i
                                  className="fas fa-check"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </div>
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-7 col-xl-8 chat-container">
              <h3>Roomname: {recipienId}</h3>
              <ul className="list-unstyled">
                {chatLog.map((log, index) => (
                  <li
                    className={`d-flex mb-2 justify-content-${
                      log.sender_id === user.name ? "end" : "start"
                    }`}
                    key={index}
                  >
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                      alt="avatar"
                      className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                      width="60"
                    />
                    <div className="card">
                      <div className="card-header d-flex justify-content-between p-2">
                        <p className="fw-bold mb-0">{log.sender_id}</p>

                        <p className="text-muted small mb-0">
                          <i className="far fa-clock"></i> 12 mins ago
                        </p>
                      </div>
                      <div className="card-body">
                        <p className="mb-0">{log.message}</p>
                      </div>
                    </div>
                  </li>
                ))}

                <li className="bg-white mb-3">
                  <div className="form-outline">
                    <textarea
                      className="form-control"
                      id="textAreaExample2"
                      rows="4"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                    ></textarea>
                  </div>
                </li>
                <button
                  type="button"
                  className="btn btn-info btn-rounded float-end"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatRoom;

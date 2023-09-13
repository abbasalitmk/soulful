import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../Chat/ChatRoom.css";
import AxiosInstance from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { RotatingLines } from "react-loader-spinner";

const ChatRoom = () => {
  const [chatLog, setChatLog] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [followers, setFollowers] = useState(null);
  const axios = AxiosInstance();
  const navigate = useNavigate();
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState(null);
  const sender_id = user.user_id;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Create a WebSocket connection when the component mounts
    const chatSocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${sender_id}/${recipientId}/`
    );

    chatSocket.onopen = () => {
      console.log("WebSocket connected");
    };

    chatSocket.onmessage = (e) => {
      const {
        sender,
        sender_name,
        receiver,
        receiver_name,
        message,
        profile_pic,
      } = JSON.parse(e.data);
      console.log("Received message:", {
        sender,
        sender_name,
        receiver,
        receiver_name,
        message,
        profile_pic,
      });
      setChatLog((prevLog) => [
        ...prevLog,
        { sender, sender_name, receiver, receiver_name, message },
      ]);
      console.log(chatLog);
    };

    chatSocket.onclose = () => {
      console.error("Chat socket closed unexpectedly");
    };

    setSocket(chatSocket);

    // Cleanup WebSocket when the component unmounts
    return () => {
      chatSocket.close();
    };
  }, [recipientId]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const userName = user && user.name;
    const sender = user && user.user_id;
    const message = messageInput;
    const receiver = recipientId;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          message,
          sender: sender,
          receiver: receiver,
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

  const chatHandler = (recipient, name) => {
    setRecipientId(recipient);
    setRecipientName(name);
  };

  // fetch all previous messages from chatroom
  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log(user.user_id, recipientId);
      const response = await axios.get(
        `chat/messages/${user.user_id}/${recipientId}`
      );

      if (response.status === 200) {
        console.log(response.data);
        const data = response.data;
        setChatLog((prevLog) => [...prevLog, ...data]);
        console.log(chatLog);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setChatLog([]);
    fetchMessages();
  }, [recipientId]);

  return (
    <div className="col-md-12">
      <section style={{ backgroundColor: "#eee" }}>
        <div className="container py-3">
          <div className="row">
            <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
              <h4 className="font-weight-bold mb-3 text-center text-lg-start">
                Followers
              </h4>
              <div className="card">
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    {followers &&
                      followers.length &&
                      followers.map((item) => (
                        <li
                          className="p-2"
                          key={item.id}
                          onClick={() =>
                            chatHandler(item.followed_user, item.name)
                          }
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
              {loading ? (
                <div className="text-center">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                  />
                  <p>Chat Loading</p>
                </div>
              ) : (
                <ul className="list-unstyled">
                  <h3 className="text-center">{recipientName}</h3>
                  {chatLog && chatLog.length > 0 ? (
                    chatLog.map((log, index) => (
                      <>
                        <li
                          className={`d-flex mb-2 justify-content-${
                            log.sender === user.user_id ? "end" : "start"
                          }`}
                          key={index}
                        >
                          <img
                            src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="card">
                            <div className="card-header d-flex justify-content-between p-2">
                              <p className="fw-bold mb-0">{log.sender_name}</p>

                              <p className="text-muted small mb-0">
                                <i className="far fa-clock"></i> 12 mins ago
                              </p>
                            </div>
                            <div className="card-body">
                              <p className="mb-0">{log.message}</p>
                            </div>
                          </div>
                        </li>
                      </>
                    ))
                  ) : (
                    <p className="text-center">No chats</p>
                  )}

                  <li className="bg-white mb-3">
                    <div className="form-outline">
                      <textarea
                        className="form-control border-2"
                        id="textAreaExample2"
                        rows="3"
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
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatRoom;

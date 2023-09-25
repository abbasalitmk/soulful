import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../Chat/ChatRoom.css";
import AxiosInstance from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { RotatingLines } from "react-loader-spinner";
import { v4 } from "uuid";
import axios from "axios";
import { BsSendFill } from "react-icons/bs";
import { useRef } from "react";
import toast from "react-hot-toast";

const ChatRoom = () => {
  const [chatLog, setChatLog] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [followers, setFollowers] = useState(null);
  const Axios = AxiosInstance();
  const navigate = useNavigate();
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState(null);
  const sender_id = user.user_id;
  const [loading, setLoading] = useState(false);
  const [textToTranslate, setTextToTranslate] = useState(null);
  const [translate, setTranslate] = useState(null);
  const [isPrime, setIsPrime] = useState("");

  const AZURE_KEY = process.env.REACT_APP_AZURE_KEY;
  const AZURE_LOCATION = process.env.AZURE_LOCATION;
  const chatContainerRef = useRef(null);

  // check is user prime member
  useEffect(() => {
    const checkPrime = async () => {
      try {
        const response = await Axios.get("/subscription/is-prime/");
        if (response.status === 200) {
          setIsPrime(response.data.is_prime);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    checkPrime();
  }, []);

  useEffect(() => {
    console.log("is_prime", isPrime);
  }, [isPrime]);

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

      setChatLog((prevLog) => [
        ...prevLog,
        { sender, sender_name, receiver, receiver_name, message },
      ]);
      setTextToTranslate(message);
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
    const regex = /^[a-zA-Z0-9\s]*$/;

    if (!regex.test(messageInput)) {
      toast.error("Chat contains special characters. Please remove them");
      return;
    }

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToLatestMessage = () => {
    if (chatContainerRef.current) {
      console.log(chatContainerRef);
      const chatContainer = chatContainerRef.current;
      console.log(chatContainer);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  const fetchData = async () => {
    try {
      const response = await Axios.get("/chat/followers/");
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
      const response = await Axios.get(
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

  useEffect(() => {
    const aa = chatLog && chatLog.map((log) => log.message);
    // console.log("key", process.env.REACT_APP_AZURE_KEY);
    // const key = process.env.REACT_APP_AZURE_KEY;
    const key = AZURE_KEY;

    const endpoint = "https://api.cognitive.microsofttranslator.com/";
    // const location = process.env.REACT_APP_AZURE_LOCATION;
    const location = "southeastasia";

    const translateText = async () => {
      try {
        const response = await axios.post(
          `${endpoint}/translate`,
          [
            {
              text: textToTranslate,
            },
          ],
          {
            headers: {
              "Ocp-Apim-Subscription-Key": key,
              "Ocp-Apim-Subscription-Region": location, // Location required if using a multi-service or regional resource.
              "Content-type": "application/json",
              "X-ClientTraceId": v4().toString(),
            },
            params: {
              "api-version": "3.0",
              from: "en",
              to: "ml",
            },
            responseType: "json",
          }
        );
        const translatedMessage = {
          translate: response.data[0].translations[0].text,
        };

        setChatLog((prevChatLog) => [...prevChatLog, translatedMessage]);
      } catch (error) {
        console.error(error.response);
      }
    };
    translateText();
  }, [textToTranslate]);

  // scroll down when loading chat
  useEffect(() => {
    scrollToLatestMessage();
  }, [chatLog]);

  return (
    <div className="col-md-12">
      <section style={{ backgroundColor: "#eee" }}>
        <div className="container py-3">
          <div className="row">
            <div className="col-md-4 col-lg-4 col-xl-4 mb-4 mb-md-0">
              <h4 className="font-weight-bold mb-3 text-center text-lg-start">
                Followers
              </h4>
              <div className="card followers-container ">
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
            <div className="col-md-8 col-lg-8 col-xl-8">
              <h3>Message</h3>
              <section style={{ backgroundColor: "#eee" }}>
                <div className="container">
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-12 col-lg-12 col-xl-12">
                      <div className="card" id="chat2">
                        <div className="card-header d-flex justify-content-between align-items-center p-3">
                          <h5 className="mb-0">{recipientName}</h5>

                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckDefault"
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckDefault"
                            >
                              Translation
                            </label>
                          </div>

                          <div class="mb-3">
                            <select
                              class="form-select form-select"
                              name=""
                              id=""
                            >
                              <option selected>Select Language</option>
                              <option value="ml">Malayalam</option>
                              <option value="tm">Tamil</option>
                              <option value="hn">Hindi</option>
                            </select>
                          </div>
                        </div>
                        {loading ? ( // Show loading component when loading is true
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
                          // Render the chat content when loading is false
                          <div
                            className="card-body"
                            data-mdb-perfect-scrollbar="true"
                            style={{
                              position: "relative",
                              height: "400px",
                              overflowY: "auto",
                            }}
                            ref={chatContainerRef}
                          >
                            <ul className="list-unstyled">
                              {chatLog && chatLog.length > 0 ? (
                                chatLog.map((log, index) => (
                                  <li
                                    className={`d-flex mb-2 justify-content-${
                                      log.sender === user.user_id
                                        ? "end"
                                        : "start"
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
                                        <p className="fw-bold mb-0">
                                          {log.sender_name}
                                        </p>

                                        <p className="text-muted small mb-0">
                                          <i className="far fa-clock"></i> 12
                                          mins ago
                                        </p>
                                      </div>
                                      <div className="card-body">
                                        <p className="mb-0 d-flex justify-content-between">
                                          {log.message}
                                        </p>
                                        {log.translate && (
                                          <p className="mb-0 text-center">
                                            Translated : {log.translate}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                ))
                              ) : (
                                <p className="text-center">No chats</p>
                              )}
                            </ul>
                          </div>
                        )}
                        <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                            alt="avatar 3"
                            style={{ width: "40px", height: "100%" }}
                          />
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="exampleFormControlInput1"
                            placeholder="Type message"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                          />
                          <a className="ms-1 text-muted" href="#!">
                            <i className="fas fa-paperclip"></i>
                          </a>
                          <a className="ms-3 text-muted" href="#!">
                            <i className="fas fa-smile"></i>
                          </a>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSendMessage}
                          >
                            <BsSendFill />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatRoom;

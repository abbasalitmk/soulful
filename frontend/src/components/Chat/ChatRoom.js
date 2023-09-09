import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../Chat/ChatRoom.css";

const ChatRoom = ({ roomName }) => {
  const [chatLog, setChatLog] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const userData = user ? JSON.parse(user) : null;

  useEffect(() => {
    console.log(user);
    // Create a WebSocket connection when the component mounts
    const chatSocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomName}/`
    );

    chatSocket.onopen = () => {
      console.log("WebSocket connected");
    };

    chatSocket.onmessage = (e) => {
      const { user_id, message } = JSON.parse(e.data);
      setChatLog((prevLog) => [...prevLog, { user_id, message }]);
    };

    chatSocket.onclose = () => {
      console.error("Chat socket closed unexpectedly");
    };

    setSocket(chatSocket);

    // Cleanup WebSocket when the component unmounts
    return () => {
      chatSocket.close();
    };
  }, [roomName]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const userName = userData && userData.name;
    const message = messageInput;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          message,
          user_id: userName,
        })
      );
    }

    setMessageInput("");
  };

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
                    <li
                      className="p-2 border-bottom"
                      style={{ backgroundColor: "#eee" }}
                    >
                      <a href="#!" className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">John Doe</p>
                            <p className="small text-muted">
                              Hello, Are you there?
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">Just now</p>
                          <span className="badge bg-danger float-end">1</span>
                        </div>
                      </a>
                    </li>
                    <li className="p-2 border-bottom">
                      <a href="#!" className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">Danny Smith</p>
                            <p className="small text-muted">
                              Lorem ipsum dolor sit.
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">5 mins ago</p>
                        </div>
                      </a>
                    </li>
                    <li className="p-2 border-bottom">
                      <a href="#!" className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">Alex Steward</p>
                            <p className="small text-muted">
                              Lorem ipsum dolor sit.
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">Yesterday</p>
                        </div>
                      </a>
                    </li>
                    <li className="p-2 border-bottom">
                      <a href="#!" className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-3.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">Ashley Olsen</p>
                            <p className="small text-muted">
                              Lorem ipsum dolor sit.
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">Yesterday</p>
                        </div>
                      </a>
                    </li>
                    <li className="p-2 border-bottom">
                      <a href="#!" className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-4.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">Kate Moss</p>
                            <p className="small text-muted">
                              Lorem ipsum dolor sit.
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">Yesterday</p>
                        </div>
                      </a>
                    </li>
                    <li className="p-2 border-bottom">
                      <a href="#!" className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">Lara Croft</p>
                            <p className="small text-muted">
                              Lorem ipsum dolor sit.
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">Yesterday</p>
                        </div>
                      </a>
                    </li>
                    <li className="p-2">
                      <a href="#!" className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                            alt="avatar"
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">Brad Pitt</p>
                            <p className="small text-muted">
                              Lorem ipsum dolor sit.
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">5 mins ago</p>
                          <span className="text-muted float-end">
                            <i className="fas fa-check" aria-hidden="true"></i>
                          </span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-7 col-xl-8 chat-container">
              <ul className="list-unstyled">
                {chatLog.map((log, index) => (
                  <li
                    className={`d-flex mb-2 justify-content-${
                      log.user_id === userData.name ? "end" : "start"
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
                        <p className="fw-bold mb-0">
                          {log.user_id}
                          {userData.name}
                        </p>
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

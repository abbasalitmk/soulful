import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function Chat({ user, receiver }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatSocket, setChatSocket] = useState(null); // Declare chatSocket
  const token = useSelector((state) => state.auth.token);
  const user_id = user.user_id;

  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsProtocol}://127.0.0.1:8000/ws/chat/${user_id}/`;

  useEffect(() => {
    // Establish a WebSocket connection when the component mounts
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
    };

    socket.onclose = (e) => {
      console.error("Chat socket closed unexpectedly");
      setChatSocket(null); // Reset chatSocket if closed
    };

    setChatSocket(socket); // Set chatSocket in state

    // Clean up WebSocket connection when the component unmounts
    return () => {
      if (chatSocket) {
        chatSocket.close();
      }
    };
  }, [wsUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (chatSocket) {
      // Send a new message through WebSocket
      chatSocket.send(
        JSON.stringify({
          message: newMessage,
          user_id: user.user_id,
        })
      );

      // Immediately add the message to the state
      setMessages([...messages, { sender: "You", content: newMessage }]);
      setNewMessage("");
    } else {
      console.error("Chat socket is not initialized");
    }
  };

  useEffect(() => {
    // Fetch initial messages using Axios with token authentication
    axios
      .get(`http://127.0.0.1:8000/chat/messages/${receiver.id}/`, {
        headers: {
          Authorization: `Bearer ${token.access}`, // Token authentication
        },
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token.access, receiver]);

  return (
    <div className="col-md-9">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.sender}: {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;

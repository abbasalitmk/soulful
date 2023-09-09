import React, { useState, useEffect } from "react";
import WebSocketService from "../../utils/WebSocketService";

import ChatInterface from "./ChatInterface";
import ChatInput from "./ChatInput";

const ChatComponent = ({ currentUser, followedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    WebSocketService.connect();

    return () => {
      WebSocketService.close();
    };
  }, []);

  const handleSendMessage = (message) => {
    // Send the message to the WebSocket
    WebSocketService.sendMessage({
      sender: currentUser.username,
      receiver: followedUser.username,
      text: message,
    });

    // Update the local state with the sent message
    setMessages([...messages, { sender: currentUser.username, text: message }]);
    setNewMessage("");
  };

  return (
    <div>
      <ChatInterface messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatComponent;

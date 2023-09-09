import React, { useState, useEffect } from "react";

const ChatInterface = ({ messages }) => {
  return (
    <div className="chat-interface">
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="sender">{message.sender}</span>
            <span className="text">{message.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;

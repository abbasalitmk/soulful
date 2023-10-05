import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
  const [notificationSocket, setNotificationSocket] = useState(null);
  const [notification, setNotification] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");

    socket.onopen = () => {
      console.log("WebSocket connected in context");
      setNotificationSocket(socket);
    };
    socket.onmessage = (e) => {
      const messageData = JSON.parse(e.data);

      if (
        messageData.type === "notification" &&
        messageData.receiver_id === user.user_id
      ) {
        setNotification((prev) => [...prev, messageData.message]);

        toast(messageData.message, {
          icon: "🔔",
          position: "top-center",
          style: {
            background: "#1F618D",
            color: "#fff",
          },
        });
      }
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      // Close WebSocket connection when the component unmounts
      if (notificationSocket) {
        notificationSocket.close();
      }
    };
  }, []);

  return (
    <WebsocketContext.Provider value={{ notificationSocket, notification }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebsocketContext;

import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
  const [notificationSocket, setNotificationSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");

    socket.onopen = () => {
      console.log("WebSocket connected in context");
      setNotificationSocket(socket);
    };
    socket.onmessage = (e) => {
      const messageData = JSON.parse(e.data);

      if (messageData.type === "notification") {
        setNotification(messageData.message);
        toast.success(messageData.message);
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
    <WebsocketContext.Provider value={(notificationSocket, notification)}>
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebsocketContext;

import React, { useContext, useEffect, useState } from "react";
import AxiosInstance from "../../AxiosInstance";
import toast from "react-hot-toast";
import "./Notification.css";
import config from "../../config";
import WebsocketContext from "../../context/WebsocketContext";

const Notification = () => {
  const Axios = AxiosInstance();
  const [notifications, setNotifications] = useState([]);
  const { notification } = useContext(WebsocketContext);

  // // implement websocket

  // useEffect(() => {
  //   const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");
  //   chatSocket.onopen = () => {
  //     setChatSocket(chatSocket);

  //     console.log("WebSocket connected");
  //   };

  //   chatSocket.onmessage = (event) => {
  //     const messageData = JSON.parse(event.data);
  //     if (messageData.type === "notification") {
  //       toast.success(messageData.message);
  //     }
  //   };
  //   // return () => {
  //   //   chatSocket.close();
  //   // };
  // }, []);

  // const sendNotification = () => {
  //   // Check if the WebSocket is open before sending a message
  //   if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
  //     chatSocket.send(
  //       JSON.stringify({
  //         type: "notification",
  //         message: message,
  //       })
  //     );
  //   } else {
  //     console.error("WebSocket is not open.");
  //   }

  //   setMessage("");
  // };

  const fetchNotification = async () => {
    try {
      const response = await Axios.get("match/get-requests/");
      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    fetchNotification();
  }, []);

  useEffect(() => {
    fetchNotification();
  }, [notification]);

  const acceptRequest = async (reciever) => {
    try {
      const response = await Axios.patch(`match/follow-request/${reciever}`);

      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((item) => item.sender !== reciever)
        );
        toast.success("Friend request accepted");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <section className="col">
      <div className="container">
        {notification &&
          notification.map((item) => {
            return (
              <div className="notification-ui_dd-content">
                <div className="notification-list notification-list--unread">
                  <div className="notification-list_content">
                    <div className="notification-list_detail d-flex justify-content-between">
                      <h5>
                        <p>{item}</p>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {notifications && notifications.length > 0 ? (
          notifications.map((item) => (
            <div key={item.id} className="notification-ui_dd-content">
              <div className="notification-list notification-list--unread">
                <div className="notification-list_content">
                  {/* <div className="notification-list_img">
                    <img src={config.media_url + item?.image} alt="user" />
                  </div> */}
                  <div className="notification-list_detail d-flex justify-content-between">
                    <h5>
                      <b>{item?.name} </b> Send a friend request
                    </h5>
                    <div className="ms-5">
                      <button
                        className="btn btn-sm btn-success me-1"
                        onClick={() => acceptRequest(item.sender)}
                      >
                        Accept
                      </button>
                      <button className="btn btn-sm btn-danger">Decline</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </section>
  );
};

export default Notification;

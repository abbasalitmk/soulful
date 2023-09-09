import { w3cwebsocket as W3CWebSocket } from "websocket";

const webSocket = new W3CWebSocket("ws://localhost:8000/ws/chat/");

const WebSocketService = {
  connect: () => {
    webSocket.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    webSocket.onclose = () => {
      console.log("WebSocket Client Disconnected");
    };

    webSocket.onmessage = (message) => {
      // Handle incoming messages here and update the React state accordingly
      const data = JSON.parse(message.data);
      // Implement your logic to update chat messages or user notifications
    };
  },

  sendMessage: (message) => {
    if (webSocket.readyState === webSocket.OPEN) {
      webSocket.send(JSON.stringify({ message }));
    }
  },

  close: () => {
    webSocket.close();
  },
};

export default WebSocketService;

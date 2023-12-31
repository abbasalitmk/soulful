import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import RefreshTokenProvider from "./context/RefreshTokenContext";
import { WebsocketProvider } from "./context/WebsocketContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const id = process.env.REACT_APP_CLIENT_ID;

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={id}>
      <Provider store={store}>
        <RefreshTokenProvider>
          <WebsocketProvider>
            <App />
          </WebsocketProvider>
        </RefreshTokenProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import RefreshTokenProvider from "./context/RefreshTokenContext";
import { WebsocketProvider } from "./context/WebsocketContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="987156327970-nh3iq8rb5b5ic7f65feeh49qp8bl0vvs.apps.googleusercontent.com">
        <Provider store={store}>
          <RefreshTokenProvider>
            <WebsocketProvider>
              <App />
            </WebsocketProvider>
          </RefreshTokenProvider>
        </Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

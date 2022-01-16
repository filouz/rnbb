
import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import App from "./app";
import { Provider } from "react-redux";
import store from "./store";
import config from "./config"

const root = ReactDOM.createRoot(document.getElementById("root"));

console.log('config', config)

root.render(
  <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>
);

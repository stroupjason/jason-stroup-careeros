import React from "react";
import ReactDOM from "react-dom/client";
import { AdminProvider } from "./admin/AdminContext";
import { App } from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </React.StrictMode>,
);

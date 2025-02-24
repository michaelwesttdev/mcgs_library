import "./index.css"; // import css

import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter, HashRouter } from "react-router";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

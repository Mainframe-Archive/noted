import React from "react";
import { render } from "react-dom";
import Modal from "react-modal";

import "./index.css";
import App from "./components/App";

const el = document.getElementById("root");

Modal.setAppElement(el);
render(<App />, el);

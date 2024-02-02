import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./main.css";
export let root = null;

window.renderCalendar = function (id) {
  root = document.getElementById(id);

  ReactDOM.createRoot(root).render(<App />);
};

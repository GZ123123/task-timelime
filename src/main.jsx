import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import { GROUP_TYPES } from "./constants";
import "./main.css";
export let root = null;

window.renderCalendar = function (id) {
  root = document.getElementById(id);

  root.dataset.groups = JSON.stringify([
    { id: "0", title: "キックオフ", type: GROUP_TYPES.START },
    { id: "1", title: "Marguerite" },
    { id: "2", title: "受け入れ 試験" },
    { id: "3", title: "納品", type: GROUP_TYPES.END },
  ]);
  root.dataset.items = JSON.stringify([
    {
      id: "0",
      group: "1",
      start: 1706310000000,
      end: 1720575339222,
    },
    {
      id: "-1",
      group: "0",
      title: "masker",
      type: GROUP_TYPES.START,
      start: 1706310000000,
      end: 1706310000000,
    },
    {
      id: "-2",
      group: "3",
      title: "masker",
      type: GROUP_TYPES.END,
      start: 1720575339222,
      end: 1720575339222,
    },
  ]);

  root.addEventListener("modify:groups", (e) => {
    root.dataset.groups = JSON.stringify(e.detail);

    const event = new CustomEvent("sync:groups");

    root.dispatchEvent(event);
  });

  root.addEventListener("modify:groups", (e) => {
    console.log("modify:groups", e.detail);
  });

  root.addEventListener("modify:items", (e) => {
    console.log("modify:items", e.detail);
  });

  root.addEventListener("add:items", (e) => {
    console.log("add:items", e.detail);
  });

  root.addEventListener("edit:items", (e) => {
    console.log(`edit:items`, e.detail);
  });

  ReactDOM.createRoot(root).render(<App />);
};

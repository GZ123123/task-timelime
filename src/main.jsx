import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./main.css";
export let root = null;

window.renderCalendar = function (id) {
  root = document.getElementById(id);

  // root.dataset.groups = JSON.stringify([
  //   {
  //     id: "1",
  //     title: "Marguerite",
  //     rightTitle: "Greenholt",
  //     bgColor: "#efa0c4",
  //   },
  //   { id: "2", title: "Adolphus", rightTitle: "Lebsack", bgColor: "#fcb8c7" },
  //   { id: "3", title: "Tony", rightTitle: "Bernhard", bgColor: "#fcc8c7" },
  //   { id: "4", title: "Amy", rightTitle: "Mante", bgColor: "#f29979" },
  //   { id: "5", title: "Elza", rightTitle: "Donnelly", bgColor: "#efb983" },
  //   { id: "6", title: "Jovan", rightTitle: "Davis", bgColor: "#fce299" },
  //   { id: "7", title: "Ines", rightTitle: "Trantow", bgColor: "#fcfaa1" },
  //   { id: "8", title: "Presley", rightTitle: "Auer", bgColor: "#e6f9a2" },
  //   {
  //     id: "9",
  //     title: "Brenden",
  //     rightTitle: "Satterfield",
  //     bgColor: "#d7fcae",
  //   },
  //   { id: "10", title: "Shannon", rightTitle: "Purdy", bgColor: "#96ed71" },
  // ]);
  // root.dataset.items = JSON.stringify([
  //   {
  //     id: "0",
  //     group: "10",
  //     title: "We need to program the neural SQL protocol!",
  //     start: 1706310000000,
  //     end: 1720575339222,
  //     className: "item-weekend",
  //     itemProps: {
  //       "data-tip":
  //         "Try to transmit the COM interface, maybe it will generate the solid state sensor!",
  //     },
  //   },
  // ]);

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

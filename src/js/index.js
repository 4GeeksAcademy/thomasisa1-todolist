import React from "react";
import ReactDOM from "react-dom";
import TodoList from "./component/todolist";
import "../styles/index.css"; // Import your custom CSS

// Render your react application
ReactDOM.render(<TodoList />, document.querySelector("#app"));
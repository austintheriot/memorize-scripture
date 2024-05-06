import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { getAllBooks } from "downloadScript";

getAllBooks("John", 1);

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,

	document.getElementById("root"),
);

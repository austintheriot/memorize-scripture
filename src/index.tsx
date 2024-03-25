import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { getAllBooks } from "downloadScript";

getAllBooks("Lamentations", 1);

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,

	document.getElementById("root"),
);

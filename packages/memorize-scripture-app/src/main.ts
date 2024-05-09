import "./app.css";
import App from "./App.svelte";

import * as Test from "memorize-scripture-common";
console.log(Test);
const e = document.createElement("m-s-button");
console.log(e);

const app = new App({
  target: document.getElementById("app")!,
});

export default app;

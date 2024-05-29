import initTextCondenser from "@/compiled/text_condense";
import initTextDiff from "@/compiled/text_diff";

const textCondenseInitPromise = initTextCondenser();
const textDiffInitPromise = initTextDiff();

// instantiate all wasm modules before loading the app--
// that way, we can always assume all wasm modules are valid in-app
Promise.all([textCondenseInitPromise, textDiffInitPromise]).then(
	() => import("@/components/m-s-app"),
);

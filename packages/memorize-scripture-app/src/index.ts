import "@/components/m-s-app";
import init, { Condenser } from "./compiled/text_condense";

init().then(() => {
	const condenser = new Condenser();
	condenser.run();
});

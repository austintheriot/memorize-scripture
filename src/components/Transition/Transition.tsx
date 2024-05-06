import { ReactNode } from "react";
import styles from "./Transition.module.scss";
import { useAppSelector } from "~/store/store";

export interface TransitionProps {
	children: ReactNode;
}

export const Transition = ({ children }: TransitionProps) => {
	const { menuIsOpen } = useAppSelector((s) => s.app);

	return (
		<div
			className={[styles.Transition, menuIsOpen ? styles.menuOpen : ""].join(
				" ",
			)}
		>
			{children}
		</div>
	);
};

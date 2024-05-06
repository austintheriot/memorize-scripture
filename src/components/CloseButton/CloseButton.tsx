import FocusRing from "~/components/FocusRing/FocusRing";
import React from "react";
import { conditionalStyles } from "~/utils/conditionalStyles";
import styles from "./CloseButton.module.scss";

interface Props {
  onClick: () => void;
  show: boolean;
}

export const CloseButton = ({ show, ...rest }: Props) => {
  return (
    <button
      className={conditionalStyles(["button", styles.CloseButton])}
      disabled={!show}
      {...rest}
    >
      <div className={styles.spanContainer}>
        <span className={styles.span1} aria-label="close"></span>
        <span className={styles.span2} aria-label="close"></span>
        <FocusRing />
      </div>
    </button>
  );
};

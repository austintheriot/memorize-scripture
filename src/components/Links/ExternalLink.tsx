import FocusRing from "~/components/FocusRing/FocusRing";
import useIsKeyboardUser from "~/hooks/useIsKeyboardUser";
import { ComponentProps, FC, useRef } from "react";
import { conditionalStyles } from "~/utils/conditionalStyles";
import styles from "./Links.module.scss";

interface Props extends ComponentProps<"a"> {
  to: string;
  focus?: "line" | "ring";
}

export const ExternalLink: FC<Props> = ({
  children = null,
  to,
  className = "",
  focus = "line",
  ...rest
}) => {
  const anchor = useRef<HTMLAnchorElement | null>(null);
  const isKeyboardUser = useIsKeyboardUser();

  return (
    <a
      href={to}
      ref={anchor}
      rel="noreferrer noopener"
      className={conditionalStyles([
        styles.Link,
        [styles.LinkFocus, isKeyboardUser && focus === "line"],
        className,
      ])}
      {...rest}
    >
      {children}
      {focus === "ring" && <FocusRing />}
    </a>
  );
};

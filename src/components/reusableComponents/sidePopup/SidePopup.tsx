import { ReactNode } from "react";

import classes from "./SidePopup.module.css";

const SidePopup = ({
  children,
  show,
}: {
  children: ReactNode;
  show: boolean;
}) => {
  return (
    <div className={classes.sidePopupWrapper}>
      <div
        className={`${classes.sidePopup} ${
          show ? classes.visible : classes.invisible
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default SidePopup;

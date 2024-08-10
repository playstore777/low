import { ReactNode, useEffect, useRef } from "react";

import MediumModalCross from "../../../assets/images/MediumModalCross.svg";
import SvgWrapper from "../svgWrapper/SvgWrapper";
import classes from "./PopUp.module.css";

const PopUp = ({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog?.addEventListener("cancel", handleCancel);

    return () => {
      dialog?.removeEventListener("cancel", handleCancel);
    };
  }, [isOpen, onClose]);

  return (
    <dialog ref={dialogRef} className={classes.dialog}>
      <div className={classes.dialogCloseWrapper}>
        <button className={classes.dialogClose} onClick={onClose}>
          <SvgWrapper
            SvgComponent={MediumModalCross}
            className={classes.mediumCross}
            width="29px"
          />
        </button>
      </div>
      {children}
    </dialog>
  );
};

export default PopUp;

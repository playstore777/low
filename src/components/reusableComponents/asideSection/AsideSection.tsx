import { FunctionComponent, ReactNode, SVGProps } from "react";

import MediumModalCross from "../../../assets/images/MediumModalCross.svg";
import SvgWrapper from "../svgWrapper/SvgWrapper";
import classes from "./AsideSection.module.css";

const AsideSection = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  const onClickAsideHandler = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <div className={classes.asideSectionWrapper} onClick={onClose}>
      <aside className={classes.aside} onClick={onClickAsideHandler}>
        <button className={classes.closeBtn} onClick={onClose}>
          <SvgWrapper
            SvgComponent={
              MediumModalCross as unknown as FunctionComponent<SVGProps<string>>
            }
            className={classes.mediumCross}
            width="29px"
          />
        </button>
        {children}
      </aside>
    </div>
  );
};

export default AsideSection;

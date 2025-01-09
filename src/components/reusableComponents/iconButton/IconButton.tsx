import { FunctionComponent, SVGProps } from "react";

import SvgWrapper from "../svgWrapper/SvgWrapper";
import classes from "./IconButton.module.css";

interface props {
  onClickHandler: () => void;
  SvgComponent: React.FunctionComponent<React.SVGProps<string>>;
  caption?: string;
}

const IconButton: React.FC<props> = ({
  onClickHandler,
  SvgComponent,
  caption,
}) => {
  return (
    <button className={classes.postButton} onClick={onClickHandler}>
      <SvgWrapper
        SvgComponent={
          SvgComponent as unknown as FunctionComponent<SVGProps<string>>
        }
      />
      {caption && <div className={classes.iconCaption}>{caption}</div>}
    </button>
  );
};

export default IconButton;

import { CSSProperties, useState } from "react";

import OnClickTooltip from "../tooltips/onClickTooltip/onClickTooltip";
import Tooltip from "../tooltips/tooltip/Tooltip";
import classes from "./Button.module.css";

const Button = ({
  type,
  className,
  disabled,
  disabledClass,
  label,
  style,
  onClick,
  tooltipMessage,
  tooltipType = "hover",
}: {
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  disabled?: boolean;
  disabledClass?: boolean;
  label: string;
  style?: CSSProperties;
  tooltipMessage?: string;
  tooltipType?: string;
  onClick?: () => void;
}) => {
  const [tooltip, setTooltip] = useState(true);
  const showHoverTooltip = tooltipMessage && tooltipType === "hover";
  const showClickTooltip = tooltipMessage && tooltipType === "click";
  const disabledClick = () => {
    setTooltip((prev) => !prev);
  };

  return (
    <div style={{ position: "relative" }}>
      {tooltip && showClickTooltip && (
        <OnClickTooltip
          text={tooltipMessage ?? "No tooltip message provided!"}
          visible={tooltip}
        />
      )}
      {tooltip && showHoverTooltip && (
        <Tooltip
          text={tooltipMessage ?? "No tooltip message provided!"}
          triggerTime={1000}
        />
      )}
      <button
        className={`${disabledClass ? classes.disabled : ""} ${
          className ?? classes.button
        }`}
        type={type ?? "button"}
        style={style}
        onClick={disabledClass && showClickTooltip ? disabledClick : onClick}
        disabled={disabled}
        onMouseEnter={() => {
          showHoverTooltip && setTooltip(true);
        }}
        onMouseLeave={() => setTooltip(false)}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;

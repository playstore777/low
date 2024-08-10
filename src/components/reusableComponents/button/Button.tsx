import { CSSProperties, useState } from "react";

import OnClickTooltip from "../onClickTooltip/onClickTooltip";
import classes from "./Button.module.css";

const Button = ({
  type = "button",
  className,
  disabled,
  disabledWithMessage,
  label,
  style,
  onClick,
  tooltipMessage,
  tooltipType = "hover",
}: {
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  disabledWithMessage?: boolean;
  label: string;
  style?: CSSProperties;
  tooltipMessage?: string;
  tooltipType?: string;
  onClick?: () => void;
}) => {
  const [tooltip, setTooltip] = useState(false);
  const hoverCondition = tooltipType === "hover";
  const clickCondition = tooltipType === "click";
  const disabledClick = () => {
    setTooltip((prev) => !prev);
  };

  return (
    <div style={{ position: "relative" }}>
      {tooltip && clickCondition && (
        <OnClickTooltip
          text={
            tooltipMessage?.trim()
              ? tooltipMessage?.trim()
              : "No tooltip message provided!"
          }
          visible={tooltip}
        />
      )}
      <button
        className={`${disabledWithMessage ? classes.disabled : ""} ${
          className ?? classes.button
        }`}
        type={type}
        style={style}
        onClick={
          disabledWithMessage && clickCondition ? disabledClick : onClick
        }
        disabled={disabled}
        onMouseEnter={() => {
          hoverCondition && setTooltip(true);
        }}
        onMouseLeave={() => setTooltip(false)}
      >
        <span data-title={hoverCondition ? tooltipMessage : null}>{label}</span>
      </button>
    </div>
  );
};

export default Button;

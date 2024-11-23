/**
 * Renders a button component with various configuration options.
 *
 * @param {Props} props - The properties for rendering.
 * @param {"button" | "submit" | "reset" | "text"} [props.type] - The button type, defaulting to "button".
 * @param {boolean} [props.inlineButton] - Whether the button is inline-styled.
 * @param {string} [props.className] - Additional CSS class names for styling.
 * @param {boolean} [props.disabled] - Indicates if the button is disabled.
 * @param {boolean} [props.disabledWithMessage] - If true, displays a message when the button is disabled.
 * @param {string} props.label - The text label displayed on the button.
 * @param {CSSProperties} [props.style] - Inline styles for custom styling.
 * @param {number} [props.tabIndex] - Specifies the tab order of the button.
 * @param {string} [props.tooltipMessage] - Message displayed as a tooltip on hover.
 * @param {string} [props.tooltipType] - The type or style of tooltip (e.g., "info" or "warning").
 * @param {Function} [props.onClick] - Callback function triggered on button click.
 */
import { CSSProperties, useState } from "react";

import OnClickTooltip from "../onClickTooltip/onClickTooltip";
import classes from "./Button.module.css";

interface props {
  type?: "button" | "submit" | "reset" | "text";
  inlineButton?: boolean;
  className?: string;
  disabled?: boolean;
  disabledWithMessage?: boolean;
  label: string;
  style?: CSSProperties;
  tabIndex?: number;
  tooltipMessage?: string;
  tooltipType?: string;
  onClick?: () => void;
}

const Button: React.FC<props> = ({
  type = "button",
  inlineButton,
  className,
  disabled,
  disabledWithMessage,
  label,
  style,
  onClick,
  tabIndex,
  tooltipMessage,
  tooltipType = "hover",
}) => {
  const [tooltip, setTooltip] = useState(false);
  const hoverCondition = tooltipType === "hover";
  const clickCondition = tooltipType === "click";
  const disabledClick = () => {
    setTooltip((prev) => !prev);
  };

  return (
    <div
      style={{
        position: "relative",
        display: inlineButton ? "inline" : "block",
      }}
    >
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
        } ${type === "text" && classes.textBtn}`}
        type={type === "text" ? "button" : type}
        style={style}
        onClick={
          disabledWithMessage && clickCondition ? disabledClick : onClick
        }
        disabled={disabled}
        onMouseEnter={() => {
          hoverCondition && setTooltip(true);
        }}
        onMouseLeave={() => setTooltip(false)}
        tabIndex={tabIndex}
      >
        <span data-title={hoverCondition ? tooltipMessage : null}>{label}</span>
      </button>
    </div>
  );
};

export default Button;

import React from "react";

interface SvgWrapperProps {
  SvgComponent: React.FunctionComponent<React.SVGProps<string>>;
  fillColor?: string;
  width?: string;
  height?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const SvgWrapper: React.FC<SvgWrapperProps> = ({
  SvgComponent,
  fillColor,
  width = "100%",
  height = "100%",
  className,
  disabled,
  onClick,
}) => {
  return (
    <SvgComponent
      className={className || ""}
      style={{
        width: width,
        height: height,
        color: fillColor,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={!disabled ? onClick : () => {}}
    />
  );
};

export default SvgWrapper;

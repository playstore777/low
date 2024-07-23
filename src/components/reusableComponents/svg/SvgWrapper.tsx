import React from "react";

interface SvgWrapperProps {
  SvgComponent: React.FunctionComponent<React.SVGProps<string>>;
  fillColor?: string;
  width?: string;
  height?: string;
  className?: string;
  onClick?: () => void
}

const SvgWrapper: React.FC<SvgWrapperProps> = ({
  SvgComponent,
  fillColor,
  width = "100%",
  height = "100%",
  className,
  onClick,
}) => {
  return (
    <SvgComponent
      className={className || ""}
      style={{ width: width, height: height, color: fillColor }}
      onClick={onClick}
    />
  );
};

export default SvgWrapper;

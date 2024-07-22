import React from "react";

interface SvgWrapperProps {
  SvgComponent: React.FunctionComponent<React.SVGProps<string>>;
  fillColor?: string;
  width?: string;
  height?: string;
  className?: string;
}

const SvgWrapper: React.FC<SvgWrapperProps> = ({
  SvgComponent,
  fillColor,
  width = "100%",
  height = "100%",
  className,
}) => {
  return (
    <SvgComponent
      className={className || ""}
      style={{ width: width, height: height, color: fillColor }}
    />
  );
};

export default SvgWrapper;

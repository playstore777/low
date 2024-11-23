/**
 * @param {Props} props - The properties for rendering.\
 * @param {boolean} [props.disabled] - A boolean to indicate state of the component.
 * @param {Function} [props.onClick] - Method to trigger on click.
 * @param {number} [props.label] - A number to display with an icon.
 */

import React from "react";
import Clap from "../../../assets/images/MediumClap.svg";
import SvgWrapper from "../svgWrapper/SvgWrapper";

interface props {
  disabled: boolean;
  onClick: () => void;
  label: number;
}

const ClapIcon: React.FC<props> = ({ disabled, onClick, label }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        userSelect: "none",
      }}
    >
      <SvgWrapper
        SvgComponent={
          Clap as unknown as React.FunctionComponent<React.SVGProps<string>>
        }
        width="24px"
        disabled={disabled}
        onClick={onClick}
      />
      {label}
    </div>
  );
};

export default ClapIcon;

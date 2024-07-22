import React from "react";

import "./onClickTooltip.css";

interface OnClickTooltipProps {
  text: string;
  visible: boolean;
  setVisible?: (value: boolean) => void;
}

const OnClickTooltip: React.FC<OnClickTooltipProps> = ({ text, visible }) => {
  return (
    <>
      {visible && (
        <div className="onclick-tooltip-content">
          <div className="on-click-tooltip-arrow"></div>
          {text}
        </div>
      )}
    </>
  );
};

export default OnClickTooltip;

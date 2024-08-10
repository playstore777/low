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
          <div className="onclick-tooltip-arrow"></div>
          {text.length < 200 ? text : text.slice(0, 200) + "..."}
        </div>
      )}
    </>
  );
};

export default OnClickTooltip;

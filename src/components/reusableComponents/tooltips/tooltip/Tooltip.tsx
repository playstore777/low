import React, { useEffect, useState } from "react";

import "./Tooltip.css";

interface TooltipProps {
  text: string;
  triggerTime?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ text, triggerTime }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  useEffect(() => {
    const timeout = triggerTime ?? 3000;
    const timer = setTimeout(() => {
      showTooltip();
    }, timeout);

    return () => {
      if (visible) hideTooltip();
      clearTimeout(timer);
    };
  }, [visible, triggerTime]);

  return (
    <>
      {visible && (
        <div className="tooltip-content">
          <div className="tooltip-arrow"></div>
          {text}
        </div>
      )}
    </>
  );
};

export default Tooltip;

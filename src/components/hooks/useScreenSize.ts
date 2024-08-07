import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const setCurrSize = () => {
      setScreenSize(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", setCurrSize);
    return () => {
      window.removeEventListener("resize", setCurrSize);
    };
  });
  return { screenSize, isMobile };
};

export default useScreenSize;

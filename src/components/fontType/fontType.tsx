import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../store/rootReducer";
import { changeFontType } from "../../store/slices/fontTypeSlice";
import Button from "../reusableComponents/button/Button";

const FontType = () => {
  const dispatch = useAppDispatch();
  const { fontType } = useAppSelector((state) => state.fontType);

  const toggleFontType = () => {
    const updatedFontType = fontType === "normal" ? "live" : "normal";
    dispatch(changeFontType(updatedFontType));
  };

  useEffect(() => {
    const savedFontType = localStorage.getItem("ls-font-type") ?? "normal";
    if (savedFontType) {
      dispatch(changeFontType(savedFontType));
    }
  }, []);

  useEffect(() => {
    fontType === "live" && document.body.classList.add("live-text");
    fontType === "normal" && document.body.classList.remove("live-text");
    localStorage.setItem("ls-font-type", fontType); // ls -> less work
  }, [fontType]);

  return <Button label={`Font Type: ${fontType}`} onClick={toggleFontType} />;
};

export default FontType;
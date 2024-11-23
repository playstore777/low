/**
 * @param {null} props - Unused props
 */
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../store/rootReducer";
import { changeTheme } from "../../store/slices/themeSlice";
import Button from "../reusableComponents/button/Button";

interface props {}

const ThemeToggle: React.FC<props> = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);

  const toggleTheme = () => {
    const updatedTheme = theme === "light" ? "dark" : "light";
    dispatch(changeTheme(updatedTheme));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("ls-theme") ?? "light";
    if (savedTheme) {
      dispatch(changeTheme(savedTheme));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("low-theme", theme);
  }, [theme]);

  return <Button label={`Theme: ${theme}`} onClick={toggleTheme} />;
};

export default ThemeToggle;

import { useRef, useEffect, CSSProperties } from "react";
import classes from "./ContextMenu.module.css";

export type Position = {
  x: number;
  y: number;
};

export type MenuItems = {
  label: string;
  styles?: CSSProperties;
  onClick: () => void;
};

const ContextMenu = ({
  position,
  menuItems,
  onClose,
}: {
  position: Position;
  menuItems: MenuItems[];
  onClose: () => void;
}) => {
  const { x, y } = position;
  const menuRef = useRef<null | HTMLElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    // Add the event listener to the ref element
    const currentMenuRef = menuRef.current;
    if (currentMenuRef) {
      currentMenuRef.addEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      // Clean up the event listener when the component unmounts
      if (currentMenuRef) {
        currentMenuRef.removeEventListener(
          "mousedown",
          handleClickOutside,
          true
        );
      }
    };
  }, []);

  return (
    <ul
      className={classes.contextMenu}
      style={{ top: y, left: x }}
      onClick={onClose}
    >
      {menuItems.map((item, index) => (
        <li
          key={index}
          className={classes.menuItem}
          style={item?.styles}
          onClick={item.onClick}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default ContextMenu;

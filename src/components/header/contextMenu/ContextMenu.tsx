import { CSSProperties } from "react";

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

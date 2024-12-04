/**
 * @param {Props} props - The properties for rendering the post.
 * @param {Position} [props.position] - The position in x and y cords.
 * @param {MenuItem[]} [props.menuItems] - The menu items list.
 * @param {Function} [props.onClose] - Method to trigger after close.
 */

import { CSSProperties } from "react";

import classes from "./ContextMenu.module.css";

interface props {
  position: Position;
  menuItems: MenuItem[];
  onClose: () => void;
}

export type Position = {
  x: number;
  y: number;
};

export type MenuItem = {
  label: string;
  styles?: CSSProperties;
  onClick?: () => void;
};

const ContextMenu: React.FC<props> = ({ position, menuItems, onClose }) => {
  const { x, y } = position;

  return (
    <div className={classes.contextMenuWrapper} onClick={onClose}>
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
    </div>
  );
};

export default ContextMenu;

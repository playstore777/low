/**
 * @param {Props} - The properties for rendering
 * @param {ReactNode} [props.children] - The children to render.
 */

import { ReactNode } from "react";

interface props {
  children: ReactNode;
}

const Sidebar: React.FC<props> = ({ children }) => {
  return <section className="sidebar">{children}</section>;
};

export default Sidebar;

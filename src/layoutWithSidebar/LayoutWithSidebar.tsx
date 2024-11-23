/**
 * @param {Props} props - The properties for rendering.
 * @param {ReactNode} [props.children] - The children to render.
 * @param {boolean} [props.sidebar] - A boolean to show/hide sidebar.
 */

import { ReactNode } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import "./LayoutWithSidebar.css";

interface props {
  children: ReactNode[];
  sidebar?: boolean;
}

const LayoutWithSidebar: React.FC<props> = ({ children, sidebar = true }) => {
  return (
    <div className="layout-with-sidebar-wrapper">
      <Header />
      <div className="layout-with-sidebar">
        <div className="layout-main">{children[0]}</div>
        <div className="layout-sidebar">
          {sidebar && <Sidebar>{children[1]}</Sidebar>}
        </div>
      </div>
    </div>
  );
};

export default LayoutWithSidebar;

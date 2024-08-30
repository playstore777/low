import { ReactNode } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import "./LayoutWithSidebar.css";

const LayoutWithSidebar = ({ children }: { children: ReactNode[] }) => {
  return (
    <div className="layout-with-sidebar-wrapper">
      <Header />
      <div className="layout-with-sidebar">
        <div className="layout-main">{children[0]}</div>
        <div className="layout-sidebar">
          <Sidebar>{children[1]}</Sidebar>
        </div>
      </div>
    </div>
  );
};

export default LayoutWithSidebar;

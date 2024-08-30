import { ReactNode } from "react";

const Sidebar = ({ children }: { children: ReactNode }) => {
  return <section className="sidebar">{children}</section>;
};

export default Sidebar;

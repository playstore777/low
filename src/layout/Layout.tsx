/**
 * @param {null} props - Unused props
 */

import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router";

import Header from "../components/header/Header";
import "./Layout.css";

interface props {}

const Layout: React.FC<props> = () => {
  return (
    <>
      <Header />
      <div className="main-container">
        <Outlet />
      </div>
      <ToastContainer
        data-testid="toast-container"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
};

export default Layout;

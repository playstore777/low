import { Outlet } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";

import "./Layout.css";
import Header from "../components/header/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="main-container">
        <Outlet />
      </div>
      <ToastContainer
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

/**
 * @param {null} props - Unused props
 */
// import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import "./App.css";

interface props {}

const App: React.FC<props> = () => {
  return (
    <>
      <div className="main">
        <Home />
        {/* <Sidebar>
          <>Side bar</>
        </Sidebar> */}
      </div>
    </>
  );
};

export default App;

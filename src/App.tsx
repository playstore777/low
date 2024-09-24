import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import "./App.css";

function App() {
  return (
    <>
      <div className="main">
        <Home />
        <Sidebar>
          <>Side bar</>
        </Sidebar>
      </div>
    </>
  );
}

export default App;

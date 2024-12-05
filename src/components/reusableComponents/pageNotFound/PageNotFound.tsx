import Header from "../../header/Header";

const PageNotFound = () => {
  return (
    <div>
      <Header />
      <main
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{fontSize: "5rem"}}>404 Not Found</span>
      </main>
    </div>
  );
};

export default PageNotFound;

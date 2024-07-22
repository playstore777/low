import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "../App";
import Layout from "../layout/Layout";
import ManipulatePost from "../components/manipulatePost/ManipulatePost";
import Login from "../components/authentication/Login";
import PostView from "../components/postView/PostView";
import { useAppSelector } from "../store/rootReducer";

const AppRouter = () => {
  const { activePost } = useAppSelector((state) => state.post);
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <App />,
        },
        {
          path: "new",
          element: <ManipulatePost isNewPost={activePost.isEditMode} />,
        },
        {
          path: "post/:postId",
          element: <PostView key={location.pathname} fetchData={fetchData} />,
        },
        {
          path: "post/:postId/edit",
          element: (
            <ManipulatePost
              key={location.pathname}
              isNewPost={!activePost.isEditMode}
            />
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;

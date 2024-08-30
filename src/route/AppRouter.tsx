import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ManipulatePost from "../components/manipulatePost/ManipulatePost";
import UserProfile from "../components/userProfile/userProfile";
import PostView from "../components/postView/PostView";
import { useAppSelector } from "../store/rootReducer";
import Layout from "../layout/Layout";
import App from "../App";

const AppRouter = () => {
  const { activePost } = useAppSelector((state) => state.post);
  const router = createBrowserRouter([
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
          element: <PostView key={location.pathname} />,
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
    {
      path: "/:name",
      element: <UserProfile />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;

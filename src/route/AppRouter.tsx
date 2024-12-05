import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ManipulatePost from "../components/manipulatePost/ManipulatePost";
import PageNotFound from "../components/reusableComponents/pageNotFound/PageNotFound";
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
          element: (
            <ManipulatePost key={"new"} isNewPost={activePost.isEditMode} />
          ),
        },
        {
          path: "post/:postId",
          element: <PostView key={location.pathname + "view-post"} />,
        },
        {
          path: "post/:postId/edit", // maybe change it to ?edit later!
          element: (
            <ManipulatePost key={"edit"} isNewPost={!activePost.isEditMode} />
          ),
        },
      ],
    },
    {
      path: "/pageNotFound", // not working ;(
      element: <PageNotFound />,
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

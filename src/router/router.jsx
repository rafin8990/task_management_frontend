import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/MainLayout";
import Home from "../components/mainComponents/home/Home";
import ErrorPage from "../components/shared/error/ErrorPage";
import Tasks from "../components/dashboardComponents/tasks/Tasks";
import SignIn from "../components/context/auth/signIn/SignIn";
import Register from "../components/context/auth/register/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../components/dashboardComponents/dashboard/Dashboard";
import PrivateRoute from "../components/shared/privateRoute/PrivateRoute";
import MyTask from "../components/dashboardComponents/tasks/MyTask";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/tasks",
        element: <Tasks />,
      },
      {
        path: "/dashboard/my-task",
        element: <MyTask />,
      },
    ],
  },
]);
export default router;

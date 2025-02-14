import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { WorkspaceProvider } from "./components/context/workspace/WorkspaceContext.jsx";
import AuthProvider from "./components/context/auth/authProvider/AuthProvider.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WorkspaceProvider>
        <RouterProvider router={router}></RouterProvider>
      </WorkspaceProvider>
    </AuthProvider>
    <Toaster />
  </QueryClientProvider>
);

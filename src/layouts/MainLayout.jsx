import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/shared/navber/Navbar";
import Footer from "../components/shared/footer/Footer";

const MainLayout = () => {
  const location = useLocation();
  return (
    <main>
      {location?.pathname === "/login" ||
        location?.pathname === "/register" || <Navbar />}
      <Outlet />
      {location?.pathname === "/login" ||
        location?.pathname === "/register" || <Footer />}
    </main>
  );
};

export default MainLayout;

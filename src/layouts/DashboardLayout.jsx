import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/dashboardComponents/shared/navbar/DashboardNavbar";
import Sidebar from "../components/dashboardComponents/shared/sidebar/Sidebar";
const DashboardLayout = () => {

  return (
    <section className="bg-white dark:bg-dark dark:text-white">
  
      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <Sidebar  />
        </div>
        <div className="col-span-10">
          <DashboardNavbar />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
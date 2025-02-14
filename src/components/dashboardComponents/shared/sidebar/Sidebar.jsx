import PropTypes from "prop-types";
import logo from "../../../../assets/logo.png";
import whiteLogo from "../../../../assets/white-logo.png";
// import gradientLogo from "../../../../assets/gradient-logo.png";
import homeIcon from "../../../../assets/icons/home.svg";
import taskIcon from "../../../../assets/icons/task.svg";
// import { FaUserPlus } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// { setOpenModal }
const Sidebar = () => {
  // const { user } = useContext(AuthContext);
// Access workspaces and switchWorkspace function
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { id: 1, name: "Dashboard", route: "/dashboard", icon: homeIcon },
    { id: 2, name: "Tasks", route: "/dashboard/tasks", icon: taskIcon },
    { id: 3, name: "My Tasks", route: "/dashboard/my-task", icon: taskIcon },
  ];



  return (
    <section className="border dark:border-secondaryDark border-e-2  h-screen sticky top-0  py-4 flex-col justify-between flex">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-start px-10"
      >
        <img src={ logo} className="h-12" alt="" />
        {/* <img src={isDarkMode ? whiteLogo : logo} className="h-12" alt="" /> */}
        <h1 className="ms-3 text-2xl font-light mt-1">
          <p className="">Endeavor Align</p>
        </h1>
      </div>

      {/* <div className="">
        <div
          className={px-10 py-5 mt-5 flex items-center justify-between bg-dark dark:bg-secondaryDark text-white relative overflow-hidden w-full}
        >
          <div>
            <p className="text-xs opacity-75">Workspace -</p>
            <h2 className="text-xl capitalize">
              {activeWorkspace?.name.length > 17 ? (
                <span className="capitalize" title={activeWorkspace?.name}>
                  {activeWorkspace?.name.slice(0, 17)}...
                </span>
              ) : (
                activeWorkspace?.name
              )}
            </h2>
          </div>
          <img
            className="h-[5.2rem] absolute -left-16"
            src={whiteLogo}
            alt=""
          />
          <button className="cursor-pointer" onClick={toggleDropdown}>
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </div>
      </div> */}
      <nav className="mt-10 dashboard grow relative">
        <ul className="">
          {links.map((link) => (
            <li className="" key={link.id}>
              <NavLink
                className={`flex items-center py-4 px-10 text-base font-semibold relative overflow-hidden  ${
                  location.pathname === link.route
                    ? "text-white bg-dark dark:bg-secondaryDark"
                    : "border- hover:bg-secondary dark:hover:bg-secondaryDark"
                }`}
                to={link.route}
              >
                <img
                  className={`h-20 absolute -right-10 -bottom-3 opacity-20 ${
                    location.pathname === link.route ? "inline" : "hidden"
                  }`}
                  src={whiteLogo}
                  alt=""
                />
                <div className="flex items-center">
                  <div
                    className={`icon-container ${
                      location.pathname === link.route ? "active" : ""
                    }`}
                  >
                    <img
                      src={link.icon}
                      className={`${
                        link.name === "Meeting"
                          ? "me-3 h-8 w-8"
                          : "me-4 h-7 w-7"
                      }`}
                      alt={link.name}
                    />
                  </div>
                  <span>{link.name}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
    
      </nav>
 
    </section>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  setOpenModal: PropTypes.func,
};
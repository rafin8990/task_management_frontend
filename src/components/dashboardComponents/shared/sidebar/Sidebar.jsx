import PropTypes from "prop-types";
import logo from "../../../../assets/logo.png";
import whiteLogo from "../../../../assets/white-logo.png";
// import gradientLogo from "../../../../assets/gradient-logo.png";
import homeIcon from "../../../../assets/icons/home.svg";
import taskIcon from "../../../../assets/icons/task.svg";
// import { FaUserPlus } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useWorkspace } from "../../../context/workspace/WorkspaceContext";
import AddMemberModal from "../../modals/AddMemberModal";
import usePostData from "../../hooks/usePostData";
import { AuthContext } from "../../../context/auth/authProvider/AuthProvider";
// { setOpenModal }
const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const {
    workspaces,
    switchWorkspace,
    activeWorkspace,
    refetchWorkspace,
    refetchTasks,
    sendWorkspaceMembersEmails,
    refetchNotifications,
    isDarkMode,
  } = useWorkspace(); // Access workspaces and switchWorkspace function
  const { postData } = usePostData();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { id: 1, name: "Dashboard", route: "/dashboard", icon: homeIcon },
    { id: 2, name: "My Tasks", route: "/dashboard/tasks", icon: taskIcon },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleWorkspaceSwitch = (workspaceId) => {
    console.log("object", workspaceId);
    switchWorkspace(workspaceId); // Call switchWorkspace function with the selected workspaceId
    setIsOpen(false); // Close the dropdown after switching workspace
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (data) => {
    const updates = {
      userData: {
        userName: user.displayName,
        userEmail: user.email,
        sendTo: data.email,
      },
      workspaceData: {
        workspaceId: activeWorkspace.id,
        workspaceName: activeWorkspace.name,
      },
    };
    console.log({
      workspaceId: activeWorkspace.id,
      workspaceName: activeWorkspace.name,
    });
    try {
      await postData(`/workspaces/send-confirmation-email`, updates);

      const notification = {
        user_name: user?.displayName,
        user_email: user?.email,
        user_photo: user?.photoURL,
        workspace_id: activeWorkspace?.id,
        message: `${user?.displayName} invite ${data.email} to join ${activeWorkspace.name}`,
      };
      postData(`/notifications`, notification, (responseData, error) => {
        if (!error) {
          // Handle success
          refetchNotifications();
          console.log("Response: update from here", responseData);
        } else {
          // Handle error
          refetchNotifications();
          console.error("Error:", error);
          // Display error message to the user
        }
      });
      refetchNotifications();
      console.log("Email sent successfully!");
      // You can add more logic here after successful post
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle error here
    }

    refetchWorkspace();
    sendWorkspaceMembersEmails();
    refetchTasks();
    // After handling the submission, close the modal
    handleCloseModal();
  };

  return (
    <section className="border dark:border-secondaryDark border-e-2  h-screen sticky top-0  py-4 flex-col justify-between flex">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-start px-10"
      >
        <img src={isDarkMode ? whiteLogo : logo} className="h-12" alt="" />
        <h1 className="ms-3 text-2xl font-light mt-1">
          <p className="">Endeavor Align</p>
        </h1>
      </div>

      {/* <div className="">
        <div
          className={`px-10 py-5 mt-5 flex items-center justify-between bg-dark dark:bg-secondaryDark text-white relative overflow-hidden w-full`}
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
        {isOpen && (
          <div className="dropdown-content bg-white/80 dark:bg-secondaryDark/80 backdrop-blur-md pb-6 pt-0.5 absolute -top-12 left-0 mt-2 w-full z-10 shadow-md h-[82vh]">
            {/* Display a list of workspaces for switching */}
            <p className="bg-white dark:bg-dark text-black dark:text-white text-xs font-semibold py-1.5 px-10 ">
              All Workspaces -
            </p>
            <div>
              {workspaces.map((workspace) => (
                <button
                  key={workspace?.id}
                  className=" w-full py-3 px-10 bg-dark hover:bg-secondaryDark mb-0.5 text-white text-start relative overflow-hidden capitalize"
                  onClick={() => handleWorkspaceSwitch(workspace.id)}
                >
                  <h2 className="">{workspace?.name}</h2>
                  <img
                    className={`h-20 absolute -right-10 -bottom-3 opacity- z-20 ${
                      workspace?.id === activeWorkspace?.id
                        ? "inline"
                        : "hidden"
                    }`}
                    src={whiteLogo}
                    alt=""
                  />
                </button>
              ))}
            </div>
           
          </div>
        )}
      </nav>
  
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  setOpenModal: PropTypes.func,
};

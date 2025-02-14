import { Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import useDeleteData from "../hooks/useDeleteData";
import { TiDelete } from "react-icons/ti";
import dotIcon from "../../../assets/icons/dot.svg";
import { MdOutlineClose } from "react-icons/md";
import gradientLogo from "../../../assets/gradient-logo.png";
import whiteLogo from "../../../assets/white-logo.png";
import blackLogo from "../../../assets/logo.png";
import { ImStopwatch } from "react-icons/im";
import useAxios from "../hooks/useAxios";
import { BiMessageAltDetail } from "react-icons/bi";
import { CgEditMarkup } from "react-icons/cg";
import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import EditTaskModal from "../modals/EditTaskModal";
import TaskDetailsModal from "../modals/TaskDetailsModal";

const Task = ({
  task,
  index,
  refetchTasks,
  refetchTotalCompletedTasks,
  isDarkMode,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [taskMembersData, setTaskMembersData] = useState([]);
  const deleteData = useDeleteData();
  const axiosPublic = useAxios();

  const [isExpanded, setIsExpanded] = useState(false);
  const { id, title, image, description, priority, startDate, endDate } = task;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const words = description.split(" ");
  const shouldTruncate = words.length > 25;
  const displayText =
    shouldTruncate && !isExpanded
      ? words.slice(0, 25).join(" ") + "..."
      : description;

  const handleShowTaskDetails = () => {
    // Handle edit functionality
    setIsOpenDetailsModal(true);
  };

  const handleEdit = () => {
    setIsUpdating(false);
    setIsOpenEditModal(true);
  };

  const handleDelete = () => {
    deleteData(`/tasks/${id}`, refetchTasks);
    refetchTasks();
    setIsDeleting(true);
    setIsOpenSidebar(false);
  };

  // Function to send task members' emails to the backend
  const sendTaskMembersEmails = async () => {
    try {
      const response = await axiosPublic.post("/tasks/members-details", {
        taskMembersEmails: task.members,
      });

      setTaskMembersData(response.data);
    } catch (error) {
      console.error("Error fetching task members' details:", error);
    }
  };

  useEffect(() => {
    // Fetch task members' details when the component mounts
    sendTaskMembersEmails();
  }, [task]); // Empty dependency array to ensure this effect runs only once when the component mounts

  // Render null if task is null or undefined
  if (!task) {
    return null;
  }
  const handleTaskDrop = () => {
    // Update the task's column in the backend
    refetchTasks();
    refetchTotalCompletedTasks();
  };

  const isOverdue = new Date(task.endDate) < new Date();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onChange={handleTaskDrop} // Call handleTaskDrop when the task is dropped
        >
          <div
            className={`task border-2 dark:border-secondaryDark p-5 mb-3 relative overflow-hidden ${
              isOverdue ? "border-red-500" : ""
            }`}
          >
            {/* ALL MODAL  */}
            {/* DELETE MODAL  */}
            <Modal
              show={openModal}
              size="md"
              popup
              onClose={() => setOpenModal(false)}
              className="rounded-none backdrop-blur-"
            >
              <Modal.Body className="border-2 border-dark input-primary rounded-none p-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-dark dark:text-white">
                      Confirmation
                    </h3>
                    <button
                      onClick={() => {
                        setIsOpenSidebar(false);
                        setOpenModal(false);
                      }}
                      className="bg-dark p-1.5 text-white"
                    >
                      <IoMdClose />
                    </button>
                  </div>
                  <p className="text-dark dark:text-white">
                    Are you sure you want to delete this Task?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        handleDelete();
                        setOpenModal(false);
                      }}
                      className="text-center text-sm border-2 border-red-500 py-2.5 px-6 rounded-none button-danger hover:bg-red-500 hover:text-white text-red-500"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setIsOpenSidebar(false);
                        setOpenModal(false);
                      }}
                      className="text-center text-sm border-2 border-dark py-2.5 px-6 rounded-none button-primary bg-dark text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            {/* task menu  */}
            <img
              className={`h-24 absolute -right-14 -top-7 opacity-5 z-5 `}
              src={gradientLogo}
              alt=""
            />

            <div
              className={`absolute top-0 ${
                isOpenSidebar ? "right-0" : "-right-[96rem]"
              } h-full w-full backdrop-blur-sm transition-all ease-in-out z-10 `}
            >
              <div
                className={`w-10/12 bg-white dark:bg-secondaryDark h-full border-r-2 dark:border-dark top-0 right-0 `}
              >
                <p className="text-sm px-5 py-3 text- font-semibold">
                  Task Actions -
                </p>
                {/* update button  */}
                <button
                  onClick={() => handleShowTaskDetails(id)}
                  disabled={isUpdating}
                  className="bg-blue-500 hover:bg-blue-600 text-white font- py-2 px-4 rounded-none w-full flex items-center gap-2 text-sm relative overflow-hidden"
                >
                  <BiMessageAltDetail className="text-lg ms-[1px]" />
                  <p className="pt-0.5">Show Task Details</p>
                  <img
                    className="h-[5.2rem] absolute -right-16"
                    src={isDarkMode ? blackLogo : whiteLogo}
                    alt=""
                  />
                </button>
                <TaskDetailsModal
                  task={task}
                  refetchTasks={refetchTasks}
                  isOpen={isOpenDetailsModal}
                  onClose={() => setIsOpenDetailsModal(false)}
                />
                {/* update button  */}
                <button
                  onClick={handleEdit}
                  disabled={isUpdating}
                  className="bg-green-500 hover:bg-green-600 text-white font-  py-2 px-4 rounded-none w-full flex items-center gap-2 text-sm relative overflow-hidden"
                >
                  <CgEditMarkup className="text-md ms-0.5" />
                  <p className="pt-0.5">
                    {" "}
                    {isUpdating ? "Editing..." : "Edit / Update Task"}
                  </p>
                  <img
                    className="h-[5.2rem] absolute -right-16"
                    src={isDarkMode ? blackLogo : whiteLogo}
                    alt=""
                  />
                </button>
                <EditTaskModal
                  task={task}
                  refetchTasks={refetchTasks}
                  isOpen={isOpenEditModal}
                  setIsOpenSidebar={setIsOpenSidebar}
                  onClose={() => setIsOpenEditModal(false)}
                />
                {/* Delete button  */}
                <button
                  onClick={() => setOpenModal(true)}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 text-white font- py-2 px-4 rounded-none w-full flex items-center gap-2 text-sm relative overflow-hidden"
                >
                  <TiDelete className="text-xl" />
                  <p className="pt-0.5">
                    {" "}
                    {isDeleting ? "Deleting..." : "Delete Task"}
                  </p>
                  <img
                    className="h-[5.2rem] absolute -right-16"
                    src={isDarkMode ? blackLogo : whiteLogo}
                    alt=""
                  />
                </button>
              </div>
            </div>

            {/* priority */}
            <div className="flex items-center justify-between">
              <div
                className={`w-2/12 h-2 rounded-full mb-3.5 ${
                  priority === "High"
                    ? "bg-gradient-to-r from-red-600 to-red-500"
                    : priority === "Medium"
                    ? "bg-gradient-to-r from-green-600 to-green-500"
                    : priority === "Low"
                    ? "bg-gradient-to-r from-orange-400 to-orange-300"
                    : ""
                }`}
              ></div>

              {/* toggle sidebar button  */}
              {isOpenSidebar ? (
                <button
                  type="button"
                  className=" text-dark dark:text-white flex items-center justify-center z-30 text-xl p-0.5"
                  onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                >
                  <MdOutlineClose />
                </button>
              ) : (
                <button
                  type="button"
                  className="p-2 pt-1 pe-0 mb-1.5 flex items-center justify-center z-30"
                  onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                >
                  <img className="w-4 " src={dotIcon} alt="" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{title}</h2>
              {image && (
                <img
                  className="h-40  w-[98%] hover:w-full object-cover button-primary border-2 border-black/20 "
                  src={image}
                  alt=""
                />
              )}
              <p className="text-xs pt-2">
                {displayText}{" "}
                {shouldTruncate && (
                  <button
                    onClick={toggleExpanded}
                    className="text-blue-500 text-xs"
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                )}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <h6 className="flex items-start text-xs ">
                <ImStopwatch className="text-base" />{" "}
                <p className="space-x-2 ms-2 mt-0.5 flex items-center font-semibold">
                  <span> {startDate}</span>{" "}
                  <p className="w-3 h-[1px] bg-dark"></p>{" "}
                  <span className={`${isOverdue ? "text-red-500" : ""}`}>
                    {endDate}
                  </span>
                </p>
              </h6>
              <div className="flex -space-x-4 rtl:space-x-reverse">
                {/* Display only the first 2 members */}
                {taskMembersData.slice(0, 2).map((member, idx) => (
                  <img
                    key={idx}
                    className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                    src={member?.image}
                    alt=""
                  />
                ))}
                {/* Check if there are more than 2 members */}
                {taskMembersData.length > 2 && (
                  <div className="relative">
                    {/* Display the count of remaining members */}
                    <span className="w-7 h-7 border-2 text-xs font-semibold border-white rounded-full dark:border-gray-800 flex items-center justify-center bg-gray-200 dark:bg-gray-700 -z-10">
                      +{taskMembersData.length - 2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    column_name: PropTypes.string,
    endDate: PropTypes.string,
    priority: PropTypes.string,
    creator: PropTypes.string,
    image: PropTypes.string,
    workspaceId: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  index: PropTypes.number.isRequired,
  isDarkMode: PropTypes.bool,
  refetchTasks: PropTypes.func,
  refetchTotalCompletedTasks: PropTypes.func,
};

export default Task;

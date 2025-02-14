import { useState, useContext } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { GoPlus } from "react-icons/go";
import Task from "./Task";
import { Modal } from "flowbite-react";
import usePostData from "../hooks/usePostData";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";
import { useWorkspace } from "../../context/workspace/WorkspaceContext";
import useUpdateData from "../hooks/useUpdateData";
import { RiCloseCircleFill } from "react-icons/ri";

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TasksBoard = () => {
  const { user } = useContext(AuthContext);
  const {
    activeWorkspace,
    tasks,
    refetchTasks,
    refetchTotalCompletedTasks,
    refetchTaskStatusData,
    refetchNotifications,
    isDarkMode,
  } = useWorkspace();
  const { postData } = usePostData();
  const [openModal, setOpenModal] = useState(false);
  const [columnId, setColumnId] = useState(null);
  const [uniqueId, setUniqueId] = useState("");
  const { updateData } = useUpdateData();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const draggedTask = tasks.find((task) => task.id === result.draggableId);

    console.log("log from", draggedTask);
    // Check if the user is the creator before allowing the move to the "complete" column
    if (
      result.destination.droppableId == "complete" &&
      activeWorkspace.creator !== user?.email
    ) {
      toast.custom(
        <div className="flex items-center py-3.5 px-5 input-primary gap-2 border-2 border-red-600 dark:text-white">
          {" "}
          <RiCloseCircleFill className="z-20 text-red-600" />
          <p className="text-xs ">
            Only the creator can move the task to complete.
          </p>
        </div>
      );
      return;
    }

    const updatedTasks = [...tasks];
    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (result.source.droppableId === result.destination.droppableId) {
      const columnTasks = updatedTasks.filter(
        (task) => task.column_name === result.source.droppableId
      );
      const [removedTask] = columnTasks.splice(startIndex, 1);
      columnTasks.splice(endIndex, 0, removedTask);

      for (let i = 0; i < columnTasks.length; i++) {
        columnTasks[i].order_position = i;
      }
    } else {
      draggedTask.column_name = result.destination.droppableId;

      updateData(
        `/tasks/${draggedTask.id}`,
        {
          column_name: result.destination.droppableId,
        },
        (responseData, error) => {
          if (!error) {
            refetchTotalCompletedTasks();
          } else {
            console.error("Error:", error);
          }
        }
      );
      refetchTaskStatusData();
      refetchTotalCompletedTasks();

      const notification = {
        user_name: user?.displayName,
        user_email: user?.email,
        user_photo: user?.photoURL,
        workspace_id: activeWorkspace?.id,
        message: `${user?.displayName} updated ${
          draggedTask.title || "a task"
        }'s column`,
      };
      postData(`/notifications`, notification, (responseData, error) => {
        if (!error) {
          refetchNotifications();
        } else {
          console.error("Error:", error);
          refetchNotifications();
        }
      });
    }
  };

  const generateUniqueId = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const idLength = 12;
    let newUniqueId = "";

    // Add current date/time to the ID
    const currentDate = new Date();
    const timestamp = currentDate.getTime(); // Get current timestamp
    newUniqueId += timestamp.toString(); // Append timestamp to ID

    // Add random characters to the ID
    for (let i = 0; i < idLength - 13; i++) {
      // Subtract 13 for the length of timestamp
      const randomIndex = Math.floor(Math.random() * characters.length);
      newUniqueId += characters[randomIndex];
    }

    newUniqueId = newUniqueId.toUpperCase();
    return newUniqueId;
  };

  const addNewTask = (columnId) => {
    setOpenModal(true);
    setColumnId(columnId); // Set the columnId in the state
    const newUniqueId = generateUniqueId(); // Generate a new unique ID
    setUniqueId(newUniqueId);
  };

  const onSubmit = (data) => {
    const newItem = {
      id: uniqueId,
      title: data?.name || "New Task",
      description: data?.description || "",
      startDate: data?.startDate,
      endDate: data?.endDate,
      priority: data?.priority || "Low",
      creator: user?.email,
      workspaceId: activeWorkspace.id,
      members: [user?.email],
      tags: [],
      image: "",
      comments: [],
      column_name: columnId,
    };

    postData("/tasks", newItem, (responseData, error) => {
      if (!error) {
        console.log("Response:", responseData);
        toast.success("Successfully added task", {
          duration: 2000,
          className: "mt-32",
        });
        reset(); // Reset the form
        refetchTasks(); // Reset the form
        setOpenModal(false); // Close the modal after successful submission
        refetchTaskStatusData();
      } else {
        console.error("Error:", error);

        toast.error("Failed to add task. Please try again later.", {
          duration: 2000,
          className: "mt-32",
        });
      }
    });
  };

  return (
    <div className="App">
      {/* MODAL  */}
      <Modal
        show={openModal}
        size="6xl"
        popup
        onClose={() => setOpenModal(false)}
        className="rounded-none backdrop-blur-sm"
      >
        <Modal.Body className="border-2 border-dark input-primary rounded-none p-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-dark dark:text-white">
                  Add New Task
                </h3>
                <button
                  onClick={() => setOpenModal(false)}
                  className="bg-dark p-1.5 text-white"
                >
                  <IoMdClose />
                </button>
              </div>

              {/* Task Name */}
              <div className="mt-3">
                <label htmlFor="name" className="text-sm font-medium">
                  Task Name{" "}
                  {errors.name && (
                    <span className="text-red-500 text-xs ms-2">
                      (Task name is required)
                    </span>
                  )}
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  id="name"
                  placeholder="Enter your task name"
                  className={`placeholder-text-black/25 placeholder:text-sm w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* Priority */}
              <div className="mt-3">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority{" "}
                  {errors.priority && (
                    <span className="text-red-500 text-xs ms-2">
                      (Priority is required)
                    </span>
                  )}
                </label>
                <select
                  {...register("priority", { required: true })}
                  id="priority"
                  className={`w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                    errors.priority ? "border-red-500" : ""
                  }`}
                  defaultValue="Low"
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="mt-3">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date{" "}
                  {errors.startDate && (
                    <span className="text-red-500 text-xs ms-2">
                      (Start date is required)
                    </span>
                  )}
                </label>
                <input
                  {...register("startDate", { required: true })}
                  type="date"
                  defaultValue={new Date().toISOString().substr(0, 10)}
                  id="startDate"
                  className={`w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* End Date */}
              <div className="mt-3">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date{" "}
                  {errors.endDate && (
                    <span className="text-red-500 text-xs ms-2">
                      (End date is required)
                    </span>
                  )}
                </label>
                <input
                  {...register("endDate", { required: true })}
                  type="date"
                  id="endDate"
                  className={`w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                    errors.endDate ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* Description */}
              <div className="mt-3">
                <label htmlFor="description" className="text-sm font-medium">
                  Description{" "}
                  {errors.description && (
                    <span className="text-red-500 text-xs ms-2">
                      (Description is required)
                    </span>
                  )}
                </label>
                <textarea
                  {...register("description")}
                  id="description"
                  placeholder="Enter task description"
                  className={`placeholder-text-black/25 placeholder:text-sm w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
              </div>

              <button
                type="submit"
                className="text-center text-sm w-full border border-dark py-3.5 border-dashed  flex items-center gap-3 justify-center button-primary bg-dark text-white"
              >
                Add Task <IoMdAdd />
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <header className="App-header">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="grid grid-cols-5 gap-3.5">
            {["upcoming", "todo", "doing", "review", "complete"].map(
              (columnId) => (
                <div key={columnId}>
                  <div className="pb-6 px-1.5 flex items-center justify-between">
                    <h2 className="font-semibold text-lg">
                      {capitalizeFirstLetter(columnId)}
                    </h2>
                    <div className="">
                      <button
                        className="button-primary bg-dark dark:bg-white text-white dark:text-dark p-1 text-lg"
                        onClick={() => addNewTask(columnId)}
                      >
                        <GoPlus />
                      </button>
                    </div>
                  </div>

                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided) => (
                      <div
                        className="characters min-h-screen overflow-y-auto"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {tasks &&
                          tasks
                            .filter((task) => task.column_name === columnId)
                            .map((task, index) => (
                              <Task
                                key={task.id}
                                refetchTasks={refetchTasks}
                                refetchTotalCompletedTasks={
                                  refetchTotalCompletedTasks
                                }
                                isDarkMode={isDarkMode}
                                task={task}
                                index={index}
                              />
                            ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            )}
          </div>
        </DragDropContext>
      </header>
    </div>
  );
};

export default TasksBoard;

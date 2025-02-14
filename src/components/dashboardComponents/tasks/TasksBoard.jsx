import { useState, useContext, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GoPlus } from "react-icons/go";
import { Modal } from "flowbite-react";
import usePostData from "../hooks/usePostData";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TasksBoard = () => {
  const { user } = useContext(AuthContext);
  const { postData } = usePostData();
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [columnId, setColumnId] = useState(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/task")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.data.data);
      });
  }, []);

  const addNewTask = (columnId) => {
    setOpenModal(true);
    setColumnId(columnId);
  };

  const onSubmit = (data) => {
    const newItem = {
      title: data?.title || "New Task",
      description: data?.description || "",
      due_date: data?.due_date,
      priority: data?.priority || "Low",
      user_id: user?.id,
      status: columnId,
      position: 1,
    };

    postData("/task", newItem, (responseData, error) => {
      if (!error) {
        setTasks((prevTasks) => [...prevTasks, responseData]);
        toast.success("Successfully added task", {
          duration: 2000,
          className: "mt-32",
        });
        reset();
        setOpenModal(false);
      } else {
        toast.error("Failed to add task. Please try again later.", {
          duration: 2000,
          className: "mt-32",
        });
      }
    });
  };

  // Handle Drag & Drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const draggedTaskId = result.draggableId;
    const newStatus = destination.droppableId;

    // Update UI optimistically
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggedTaskId ? { ...task, status: newStatus } : task
      )
    );
    console.log(newStatus);
    // Send API request to update status in backend
    try {
      await fetch(`http://localhost:5000/api/v1/task/${draggedTaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            toast.success("Task status updated!");
            setTimeout(() => {
              window.location.reload(); // Reload the page after update
            }, 500);
          }
        });
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="App">
      {/* MODAL */}
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
                <label htmlFor="title" className="text-sm font-medium">
                  Task Name{" "}
                  {errors.title && <span className="text-red-500 text-xs ms-2">(Task title is required)</span>}
                </label>
                <input
                  {...register("title", { required: true })}
                  type="text"
                  id="title"
                  placeholder="Enter your task title"
                  className={`w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* Priority */}
              <div className="mt-3">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority{" "}
                  {errors.priority && <span className="text-red-500 text-xs ms-2">(Priority is required)</span>}
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

              {/* Due Date */}
              <div className="mt-3">
                <label htmlFor="due_date" className="text-sm font-medium">
                  Due Date{" "}
                  {errors.due_date && <span className="text-red-500 text-xs ms-2">(Due date is required)</span>}
                </label>
                <input
                  {...register("due_date", { required: true })}
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  id="due_date"
                  className={`w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                    errors.due_date ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* Description */}
              <div className="mt-3">
                <label htmlFor="description" className="text-sm font-medium">
                  Description{" "}
                  {errors.description && <span className="text-red-500 text-xs ms-2">(Description is required)</span>}
                </label>
                <textarea
                  {...register("description")}
                  id="description"
                  placeholder="Enter task description"
                  className="w-full border-2 border-dark p-3.5 input-primary mt-2"
                />
              </div>


              <button
                type="submit"
                className="w-full border border-dark py-3.5 border-dashed flex items-center gap-3 justify-center bg-dark text-white"
              >
                Add Task <IoMdAdd />
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* TASK BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <header className="App-header">
          <div className="grid grid-cols-3 gap-3.5">
            {["pending", "in_progress", "completed"].map((columnId) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="border p-4 bg-gray-100 rounded-lg"
                  >
                    <div className="pb-6 px-1.5 flex items-center justify-between">
                      <h2 className="font-semibold text-lg">
                        {capitalizeFirstLetter(columnId)}
                      </h2>
                      <button
                        className="bg-dark text-white p-1 text-lg"
                        onClick={() => addNewTask(columnId)}
                      >
                        <GoPlus />
                      </button>
                    </div>

                    {/* RENDER TASKS */}
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.status === columnId)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-4 bg-white shadow rounded cursor-pointer"
                              >
                                <h3 className="font-medium">{task.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {task.description}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Priority: {task.priority}
                                </p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </header>
      </DragDropContext>
    </div>
  );
};

export default TasksBoard;

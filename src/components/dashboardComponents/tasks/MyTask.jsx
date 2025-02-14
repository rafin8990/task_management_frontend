import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user.id;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/task/user/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data.data);
      } catch (err) {
        setError("Failed to fetch tasks");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/v1/task/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="my-4">
      <div className="task px-6 py-4">
        <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Title</th>
              <th className="border-b px-4 py-2">Description</th>
              <th className="border-b px-4 py-2">Status</th>
              <th className="border-b px-4 py-2">Due Date</th>
              <th className="border-b px-4 py-2">Priority</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border-b px-4 py-2">{task.title}</td>
                <td className="border-b px-4 py-2">{task.description}</td>
                <td className="border-b px-4 py-2">{task.status}</td>
                <td className="border-b px-4 py-2">{task.due_date}</td>
                <td className="border-b px-4 py-2">{task.priority}</td>
                <td className="border-b px-4 py-2">
                  <button
                    className="text-blue-500"
                
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 ml-2"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Edit Form Modal */}
      {openModal && (
        <TaskUpdateForm
          openModal={openModal}
          setOpenModal={setOpenModal}
          taskData={selectedTask}
          setTasks={setTasks}
        />
      )}
    </section>
  );
};

export default MyTask;

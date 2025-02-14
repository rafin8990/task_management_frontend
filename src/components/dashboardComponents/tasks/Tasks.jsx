import Header from "./Header";
import TasksBoard from "./TasksBoard";

const Tasks = () => {
  return (
    <section className="">
      <Header />
      <div className="task px-6 py-4">
        <TasksBoard />
      </div>
    </section>
  );
};

export default Tasks;

import { FcAlarmClock, FcSerialTasks } from "react-icons/fc";
import { FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";
import { useContext } from "react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  console.log(user)
  const totalTasks = 15;
  const completedTasks = 8;
  const pendingTasks = 7;

  const recentActivities = [
    { title: "Task Completed", description: "You completed the 'Design homepage' task", time: "2 hours ago" },
    { title: "New Task Added", description: "You added a new task: 'Implement user authentication'", time: "5 hours ago" },
    { title: "Task Updated", description: "You updated the due date for 'Write documentation'", time: "Yesterday" },
  ];

  return (
    <section className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome back, <span className="text-indigo-600 dark:text-indigo-400"></span>!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Heres an overview of your task management dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Tasks", count: totalTasks, icon: <FcSerialTasks className="text-blue-500" size={24} />, bgColor: "bg-blue-100 dark:bg-blue-800" },
          { title: "Completed Tasks", count: completedTasks, icon: <FaCheckCircle className="text-green-500" size={24} />, bgColor: "bg-green-100 dark:bg-green-800" },
          { title: "Pending Tasks", count: pendingTasks, icon: <FcAlarmClock className="text-yellow-500" size={24} />, bgColor: "bg-yellow-100 dark:bg-yellow-800" },
        ].map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-lg shadow-md p-6 flex items-center justify-between`}>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{card.count}</p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mt-2"></div>
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{activity.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{activity.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
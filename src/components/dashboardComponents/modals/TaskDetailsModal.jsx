import { Modal } from 'flowbite-react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { IoMdClose, IoMdSend } from 'react-icons/io';
import { AuthContext } from '../../context/auth/authProvider/AuthProvider';
import { useWorkspace } from '../../context/workspace/WorkspaceContext';
import usePostData from '../hooks/usePostData';
import useUpdateData from '../hooks/useUpdateData';

const TaskDetailsModal = ({ task, isOpen, onClose, refetchTasks }) => {
  const { user } = useContext(AuthContext);
  const { updateData } = useUpdateData();
  const { postData } = usePostData();
  const { activeWorkspace, refetchNotifications } = useWorkspace();

  console.log(task);
  const handleAddComment = (e) => {
    e.preventDefault();
    const commentInput = e.target.comment.value;
    if (commentInput.trim() !== '') {
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        user: user.displayName,
        userPhoto: user.photoURL,
        text: commentInput,
        timestamp: new Date().toISOString(),
      };
      // Update task object with new comment
      const updatedTask = {
        ...task,
        comments: [...task.comments, newComment], // Assuming task.comments exists
      };

      // Send updated task object to backend
      updateData(`/tasks/${task.id}`, updatedTask, (responseData, error) => {
        if (!error) {
          // Handle success
          console.log('Response:', responseData);
          refetchTasks();
        } else {
          // Handle error
          console.error('Error:', error);
          // Display error message to the user
          refetchTasks();
        }
      });
      e.target.reset(); // Clear the comment input field after submission
      const notification = {
        user_name: user?.displayName,
        user_email: user?.email,
        user_photo: user?.photoURL,
        workspace_id: activeWorkspace?.id,
        message: `${user?.displayName} comment on ${task.title} task`,
      };
      postData(`/notifications`, notification, (responseData, error) => {
        if (!error) {
          // Handle success
          refetchNotifications();
          console.log('Response: update from here', responseData);
        } else {
          // Handle error
          refetchNotifications();
          console.error('Error:', error);
          // Display error message to the user
        }
      });
      refetchNotifications();
    }
  };

  return (
    <Modal
      show={isOpen}
      size="7xl"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-sm custom-scroll-bar"
    >
      <Modal.Body className="border-2 border-dark input-primary rounded-none p-0 custom-scroll-bar">
        <div className="space-y-4 p-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-dark dark:text-white">Task Details</h3>
            <button onClick={onClose} className="bg-dark p-1.5 text-white">
              <IoMdClose />
            </button>
          </div>

          <div className="mt-3">
            <p className="text-2xl font-semibold">{task.title}</p>
          </div>

          <div className="mt-3 flex items-center space-x-3">
            <h2 className="text-sm   text-gray-500">
              Priority - <span className="font-semibold text-black">{task.priority}</span>,
            </h2>
            <div className=" text-sm">
              <h2 className="text-sm   text-gray-500">
                Start Date - <span className="font-semibold text-black">{task.startDate}</span>,
              </h2>
            </div>

            <div className="text-sm">
              <h2 className="text-sm   text-gray-500">
                End Date - <span className="font-semibold text-black">{task.endDate}</span>,
              </h2>
            </div>
          </div>
          <div className="mt-3 space-x-3">
            <span className="text-sm mb-1 font-semibold opacity-50">Description -</span>
            <span>{task.description}</span>
          </div>

          <div className="mt-3 text-sm   text-gray-500">
            <p>
              {task.image && (
                <img
                  className="h-60 button-primary border-2 border-black/20"
                  src={task.image}
                  alt=""
                />
              )}
            </p>
          </div>

          <div className="mt-3 text-sm">
            <p>
              <strong>Members:</strong> {task.members.join(', ')}
            </p>
          </div>

          <div className="mt-3 text-sm">
            <p>
              <strong>Tags:</strong> {task.tags.join(', ')}
            </p>
          </div>
        </div>
        <div className="border-t-2 p-10 pt-0">
          <div className="pt-6">
            <h2 className="text-sm   text-gray-500">Comments - </h2>
          </div>
          <div className="">
            <form onSubmit={handleAddComment}>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  className="w-full border-2 border-dark p-2.5 input-primary mt-2 placeholder:text-sm"
                  placeholder="Add new comment here..."
                />
                <button
                  type="submit"
                  className="bg-dark text-white border-2 border-dark p-2.5 button-primary h-full text-2xl mt-2"
                >
                  <IoMdSend />
                </button>
              </div>
            </form>
            <ul>
              {task?.comments?.map((comment) => (
                <li key={comment.id} className="mt-4">
                  <div className="grid grid-cols-12 items-start gap-6">
                    <div className="pt-1 w-10 h-10 col-span-1">
                      <img
                        src={comment.userPhoto}
                        className="w-10 h-10 input-primary border-2 border-black"
                        alt=""
                      />
                    </div>
                    <div className="col-span-11 -ms-10">
                      <p className="">
                        <span className="font-semibold text-sm">{comment.user}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs">{comment.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

TaskDetailsModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
    comments: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchTasks: PropTypes.func.isRequired,
};

export default TaskDetailsModal;

import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import { useWorkspace } from "../../context/workspace/WorkspaceContext";
import useUpdateData from "../hooks/useUpdateData";
import { GrAttachment } from "react-icons/gr";
import usePostData from "../hooks/usePostData";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";

const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "2px solid #2d2d2d",
    borderRadius: "0",
    padding: "8px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#2d2d2d",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#f3f4f6",
    borderRadius: "20px",
    marginRight: "4px",
    padding: "2px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#2d2d2d",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#ee5253",
    cursor: "pointer",
    ":hover": {
      color: "#EA2027",
    },
  }),
};

const EditTaskModal = ({
  task,
  isOpen,
  onClose,
  refetchTasks,
  setIsOpenSidebar,
}) => {
  const { activeWorkspace, refetchNotifications } = useWorkspace();
  const { user } = useContext(AuthContext);
  const [editedTask, setEditedTask] = useState(task);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [tags, setTags] = useState([]);
  const { updateData } = useUpdateData();
  const { postData } = usePostData();

  const imageUploadKey = import.meta.env.VITE_IMGBB_IMAGE_UPLOAD_API;
  const [uploadedImage, setUploadedImage] = useState();

  useEffect(() => {
    if (task) {
      setSelectedMembers(
        task.members.map((member) => ({ value: member, label: member }))
      );
      setTags(task.tags.map((tag) => ({ value: tag, label: tag })));
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleCreateTag = (inputValue) => {
    const newTag = { value: inputValue, label: inputValue };
    setTags([...tags, newTag]);

    // Update editedTask with new tag
    setEditedTask((prevTask) => ({
      ...prevTask,
      tags: [...prevTask.tags, inputValue],
    }));
  };

  const handleTagsChange = (newTags) => {
    setTags(newTags);

    // Update editedTask with new tags
    const tagValues = newTags.map((tag) => tag.value);
    setEditedTask((prevTask) => ({
      ...prevTask,
      tags: tagValues,
    }));
  };

  const handleMembersChange = (selectedOptions) => {
    setSelectedMembers(selectedOptions);
    setEditedTask((prevTask) => ({
      ...prevTask,
      members: selectedOptions.map((option) => option.value),
    }));
  };

  const handleFileChange = (e) => {
    setUploadedImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const imageFile = uploadedImage;
    const formData = new FormData();
    formData.append("image", imageFile);
    const url = `https://api.imgbb.com/1/upload??expiration=6000&key=${imageUploadKey}`;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        const image = result?.data?.url;
        console.log(image);

        if (image) {
          setEditedTask((prevTask) => ({
            ...prevTask,
            image,
          }));

          updateData(
            `/tasks/${task?.id}`,
            editedTask,
            (responseData, error) => {
              if (!error) {
                // Handle success
                refetchTasks();
                setIsUpdating(false);
              } else {
                // Handle error
                setIsUpdating(false);
                console.error("Error:", error);
                // Display error message to the user
              }
            }
          );
          onClose();
          refetchTasks();
          setIsOpenSidebar(false);
        } else {
          updateData(
            `/tasks/${task?.id}`,
            editedTask,
            (responseData, error) => {
              if (!error) {
                // Handle success
                refetchTasks();
                setIsUpdating(false);
              } else {
                // Handle error
                setIsUpdating(false);
                console.error("Error:", error);
                // Display error message to the user
              }
            }
          );
          onClose();
          refetchTasks();
          setIsOpenSidebar(false);
        }
        const notification = {
          user_name: user?.displayName,
          user_email: user?.email,
          user_photo: user?.photoURL,
          workspace_id: activeWorkspace?.id,
          message: `${user?.displayName} update ${task.title} task`,
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
      });
  };

  return (
    <Modal
      show={isOpen}
      size="7xl"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-sm"
    >
      <Modal.Body className="border-2 border-dark input-primary rounded-none p-10 custom-scroll-bar">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-dark dark:text-white">
                Edit Task
              </h3>
              <button onClick={onClose} className="bg-dark p-1.5 text-white">
                <IoMdClose />
              </button>
            </div>

            <div className="mt-3">
              <label htmlFor="title" className="text-sm font-medium">
                Task Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className={
                  "w-full border-2 border-dark p-3.5 input-primary mt-2"
                }
              />
            </div>

            <div className="mt-3">
              <label htmlFor="members" className="text-sm font-medium ">
                Assign Task to Members
              </label>
              <Select
                id="members"
                name="members"
                styles={customStyles}
                className="mt-2 input-primary "
                closeMenuOnSelect={false}
                components={makeAnimated()}
                isMulti
                value={selectedMembers}
                onChange={handleMembersChange}
                options={activeWorkspace?.members.map((email) => ({
                  value: email,
                  label: email,
                }))}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <CreatableSelect
                id="tags"
                name="tags"
                styles={customStyles}
                className="input-primary placeholder:text-sm"
                isMulti
                value={tags}
                onChange={handleTagsChange}
                onCreateOption={handleCreateTag}
              />
            </div>

            <div className="grid grid-cols-8 gap-6">
              <div className=" col-span-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleChange}
                  className="w-full border-2 border-dark p-3.5 input-primary mt-2"
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className=" col-span-3">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={editedTask.startDate}
                  onChange={handleChange}
                  className="w-full border-2 border-dark p-3.5 input-primary mt-2"
                />
              </div>

              <div className=" col-span-3">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={editedTask.endDate}
                  onChange={handleChange}
                  className="w-full border-2 border-dark p-3.5 input-primary mt-2"
                />
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="fileInput" className="text-sm font-medium">
                Attach File
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="fileInput"
                  name="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  className="w-full border-2 border-dark p-3.5 input-primary mt-2 cursor-pointer flex items-center"
                >
                  <GrAttachment className="mr-2" />
                  {uploadedImage ? uploadedImage.name : "Attach File"}
                </label>
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                className="w-full border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>

            <button
              type="submit"
              className="text-center text-sm w-full border border-dark py-3.5 mt-4 border-dashed  flex items-center gap-3 justify-center button-primary bg-dark text-white"
            >
              {isUpdating ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-dark"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

EditTaskModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refetchTasks: PropTypes.func,
  setIsOpenSidebar: PropTypes.func,
};

export default EditTaskModal;

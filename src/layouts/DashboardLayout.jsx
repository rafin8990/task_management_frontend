import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/dashboardComponents/shared/navbar/DashboardNavbar";
import Sidebar from "../components/dashboardComponents/shared/sidebar/Sidebar";
import { useContext, useState } from "react";
import { Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { AuthContext } from "../components/context/auth/authProvider/AuthProvider";
import usePostData from "../components/dashboardComponents/hooks/usePostData";
import toast from "react-hot-toast";
import { useWorkspace } from "../components/context/workspace/WorkspaceContext";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const { refetchWorkspace } = useWorkspace();
  const { postData } = usePostData();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
   
    const defaultWorkspace = {
      name: data?.name,
      creator: user?.email,
      members: [user?.email],
      tasks: [],
    };
    postData("/workspaces", defaultWorkspace, (responseData, error) => {
      if (!error) {
        // Handle success
        console.log("Response:", responseData);
        // Do something with the response data
        refetchWorkspace();
        toast.success("Successfully Workspace Created", {
          duration: 2000,
          className: "mt-32",
        });
        reset();
      } else {
        // Handle error
        console.error("Error:", error);
        // Display error message to the user
      }
    });

    setOpenModal(false); // Close the modal after submission
  };
  const [openModal, setOpenModal] = useState(false);
  return (
    <section className="bg-white dark:bg-dark dark:text-white">
      {/* ADD NEW WORKSPACE MODAL  */}
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
        className="rounded-none backdrop-blur-"
      >
        <Modal.Body className="border-2 border-dark input-primary rounded-none p-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-dark dark:text-white">
                  Add New Workspace
                </h3>
                <button
                  onClick={() => setOpenModal(false)}
                  className=" bg-dark p-1.5 text-white"
                >
                  <IoMdClose />
                </button>
              </div>
              <div className="mt-3">
                <label htmlFor="name" className="text-sm font-medium">
                  Workspace Name{" "}
                  {errors.name && (
                    <span className="text-red-500 text-xs ms-2">
                      (Workspace name is required)
                    </span>
                  )}
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  id="name"
                  placeholder="Enter your workspace name"
                  className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
                />
              </div>
              <button
                type="submit"
                className="text-center text-sm w-full border border-dark py-3.5 border-dashed  flex items-center gap-3 justify-center button-primary bg-dark text-white"
              >
                Add Workspace <IoMdAdd />
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <Sidebar setOpenModal={setOpenModal} />
        </div>
        <div className="col-span-10">
          <DashboardNavbar />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;

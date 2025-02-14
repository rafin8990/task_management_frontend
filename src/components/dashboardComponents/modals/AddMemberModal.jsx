import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";
import { IoMdAdd } from "react-icons/io";
import { useForm } from "react-hook-form";

const AddMemberModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Modal
      show={isOpen}
      size="md"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-"
    >
      <Modal.Body
        className={`border-2 border-dark input-primary rounded-none p-10 ${
          errors.priority ? "border-red-500" : ""
        }`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-dark dark:text-white">
                Add New Member
              </h3>
              <button onClick={onClose} className=" bg-dark p-1.5 text-white">
                <IoMdClose />
              </button>
            </div>
            <div className="mt-3">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
                {errors.email && (
                  <span className="text-red-500 text-xs ms-2">
                    (Email is required)
                  </span>
                )}
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="Enter member's email address"
                className={`placeholder-text-black/25 placeholder:text-sm w-full border-2 border-dark p-3.5 input-primary mt-2 ${
                  errors.priority ? "border-red-500" : ""
                }`}
              />
            </div>
            <button
              type="submit"
              className="text-center text-sm w-full border border-dark py-3.5 border-dashed flex items-center gap-3 justify-center button-primary bg-dark text-white"
            >
              Add Member <IoMdAdd />
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

AddMemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddMemberModal;

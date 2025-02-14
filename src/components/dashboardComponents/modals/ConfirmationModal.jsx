import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";

const ConfirmationModal = ({
  isOpen,
  onClose,
  message,
  onConfirm,
  confirmText,
  cancelText,
}) => {
  return (
    <Modal
      show={isOpen}
      size="md"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-"
    >
      <Modal.Body className="border-2 border-dark input-primary rounded-none p-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-dark dark:text-white">
              Confirmation
            </h3>
            <button onClick={onClose} className="bg-dark p-1.5 text-white">
              <IoMdClose />
            </button>
          </div>
          <p className="text-dark dark:text-white">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="text-center text-sm border-2 border-red-500 py-2.5 px-6 rounded-none button-danger hover:bg-red-500 hover:text-white text-red-500"
            >
              {confirmText || "Confirm"}
            </button>
            <button
              onClick={onClose}
              className="text-center text-sm border-2 border-dark py-2.5 px-6 rounded-none button-primary bg-dark text-white"
            >
              {cancelText || "Cancel"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// PropTypes validation
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default ConfirmationModal;

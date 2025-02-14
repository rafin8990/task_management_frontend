import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import blackLogo from "../../../assets/logo.png";
import whiteLogo from "../../../assets/white-logo.png";
import { IoMdClose } from "react-icons/io";

const WorkspaceDetailsModal = ({
  workspace,
  isOpen,
  onClose,
  textColor,
  backgroundColor,
}) => {
  if (!workspace) {
    return null;
  }
  return (
    <Modal
      show={isOpen}
      size="4xl"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-sm"
    >
      <Modal.Body className="border-2 border-dark input-primary rounded-none pb-10 pt-5 px-0 custom-scroll-bar">
        <div className="flex justify-end px-5 mb-4">
          <button
            onClick={onClose}
            className="bg-dark p-1.5 text-white rounded-none"
          >
            <IoMdClose />
          </button>
        </div>
        <div
          className="mt-2 flex items-center gap-6 relative px-4"
          style={{
            backgroundColor,
            color: textColor,
            borderColor:
              backgroundColor === "white" ? "#F6F5F4" : backgroundColor,
          }}
        >
          <img
            className={`h-10 absolute right-5 top-0 `}
            src={textColor !== "black" ? whiteLogo : blackLogo}
            alt=""
          />
          <div className="flex items-center justify-between px- py-4 px-10">
            <h3 className="text-xs font-semibold ">Workspace Details -</h3>
          </div>
        </div>

        <div className="px-14 py-6">
          <p className="capitalize">{workspace?.name}</p>
          <div className=" pt-3">
            <p className=" text-xs font-medium  opacity-70 mb-2">
              Time Spent -
            </p>
            <h2 className="text-4xl font-light  mb-2">
              {workspace?.timeSpent?.days || 0}d,{" "}
              {workspace?.timeSpent?.hours || 0}h,{" "}
              {workspace?.timeSpent?.minutes || 0}m
            </h2>
          </div>
          <div className="flex items-center justify-start gap-3">
            <h2 className="text-xs font-medium  opacity-70 mb-2">
              Workspace Created At -{" "}
              {workspace?.created_at
                ? new Date(workspace.created_at).toLocaleDateString()
                : ""}
              ,
            </h2>
            <h2 className="text-xs font-medium  opacity-70 mb-2">
              Workspace Creator - {workspace?.creator}
            </h2>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WorkspaceDetailsModal;

WorkspaceDetailsModal.propTypes = {
  workspace: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

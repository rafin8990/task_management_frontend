import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import blackLogo from "../../../assets/logo.png";
import whiteLogo from "../../../assets/white-logo.png";
// import lookingImage from "../../../assets/illustration/topPeekI.png";
import { IoMdClose } from "react-icons/io";

const WorkspaceMembersModal = ({
  workspaceMembersData,
  isOpen,
  onClose,
  textColor,
  backgroundColor,
  creator,
}) => {
  if (!workspaceMembersData) {
    return null;
  }
  return (
    <Modal
      show={isOpen}
      size="4xl"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-sm "
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
            <h3 className="text-xs font-semibold ">Workspace Members -</h3>
          </div>
        </div>
        {workspaceMembersData &&
          workspaceMembersData?.map((member) => (
            <div
              key={member?.id}
              className="bg-secondary mt-2 relative flex items-center justify-between overflow-y-hidden px-4"
            >
              <div className="flex items-center gap-4 justify-between ">
                <div className="flex items-center gap-4 py-3.5 px-4">
                  <img
                    className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                    src={member?.image}
                    alt=""
                  />
                  <div className="">
                    <p className="capitalize">{member?.name}</p>
                    <p className="text-xs">{member?.email}</p>
                  </div>
                </div>
              </div>
              <div
                className={`p-5 font-semibold text-xl ${
                  member?.email === creator ? "block" : " hidden"
                }`}
                style={{
                  backgroundColor,
                  color: textColor,
                  borderColor:
                    backgroundColor === "white" ? "#F6F5F4" : backgroundColor,
                }}
              >
                C
              </div>
            </div>
          ))}
      </Modal.Body>
    </Modal>
  );
};

export default WorkspaceMembersModal;

WorkspaceMembersModal.propTypes = {
  workspaceMembersData: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  creator: PropTypes.string,
};

import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import blackLogo from "../../../assets/logo.png";
import whiteLogo from "../../../assets/white-logo.png";
import { IoMdClose } from "react-icons/io";

const ProfileDetailsModal = ({
  profile,
  isOpen,
  onClose,
  textColor,
  backgroundColor,
}) => {
  if (!profile) {
    return null;
  }
  return (
    <Modal
      show={isOpen}
      size="5xl"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-sm"
    >
      <Modal.Body className="border-2 border-dark input-primary rounded-none pb-10 pt-5 px-0 custom-scroll-bar">
        <div>
          <div className="flex items-center justify-between px- pb-4 px-10">
            <h3 className="text-xs font-semibold ">
              {profile?.name
                ? `${profile?.name}' Details -`
                : "Member Details -"}{" "}
            </h3>
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
              className={`h-20 absolute right-5 top-0 `}
              src={textColor !== "black" ? whiteLogo : blackLogo}
              alt=""
            />
            <img
              className="w-32 h-32 object-cover"
              src={profile?.image}
              alt=""
            />
            <div className="">
              <h2 className="text-4xl mb-1">{profile?.name}</h2>
              <h2 className="text-sm">
                Email: <span className="opacity-75">{profile?.email}</span>
              </h2>
            </div>
          </div>

          <div className="col-span-3 p-10 space-y-6">
            <div className="">
              <h3 className="text-xs font-semibold">Skills:</h3>
              {profile && profile?.skills && (
                <div className="flex items-center gap-1 mt-1">
                  {profile?.skills.map((skill, idx) => (
                    <p
                      className=" bg-dark text-white px-4 py-1 text-xs"
                      key={idx}
                    >
                      {skill}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="">
              <h3 className="text-xs font-semibold">Address:</h3>
              {profile && profile?.address && (
                <div>
                  <p>{profile?.address}</p>
                </div>
              )}
            </div>
            <div className="">
              <h3 className="text-xs font-semibold">Number:</h3>
              {profile && profile?.number && (
                <div>
                  <p>{profile?.number}</p>
                </div>
              )}
            </div>
            <div className="">
              <h3 className="text-xs font-semibold">Github Link:</h3>
              {profile && profile?.github && (
                <div>
                  <a href={profile?.github}>{profile?.github}</a>
                </div>
              )}
            </div>
            <div className="">
              <h3 className="text-xs font-semibold">LinkedIn Link:</h3>
              {profile && profile?.linkedin && (
                <div>
                  <a href={profile?.linkedin}>{profile?.linkedin}</a>
                </div>
              )}
            </div>
            <div className="">
              <h3 className="text-xs font-semibold">Facebook Link:</h3>
              {profile && profile?.facebook && (
                <div>
                  <a href={profile?.facebook}>{profile?.facebook}</a>
                </div>
              )}
            </div>
            <div className="">
              <h3 className="text-xs font-semibold">Portfolio Link:</h3>
              {profile && profile?.portfolio && (
                <div>
                  <a href={profile?.portfolio}>{profile?.portfolio}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileDetailsModal;

ProfileDetailsModal.propTypes = {
  profile: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

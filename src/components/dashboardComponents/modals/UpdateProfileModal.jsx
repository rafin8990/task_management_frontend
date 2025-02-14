import { Modal } from "flowbite-react";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

const UpdateProfileModal = ({ profile, isOpen, onClose, onUpdate }) => {
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

  const [updatedProfile, setUpdatedProfile] = useState({ ...profile });
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setUpdatedProfile(profile);
    // Parse skills from profile and set as initial value for skills state
    if (profile.skills) {
      setSkills(
        profile.skills.map((skill) => ({ label: skill, value: skill }))
      );
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setSkills(value);
    } else {
      setUpdatedProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };
  const handleSkillsChange = (newValue) => {
    setSkills(newValue);
  };

  const handleCreateSkills = (inputValue) => {
    const newTag = { label: inputValue, value: inputValue };
    setSkills([...skills, newTag]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      ...updatedProfile,
      skills: skills.map((skill) => skill.value),
    };

    // Call onUpdate with the updated data
    onUpdate(updatedData);
    onClose();
    console.log(updatedData);
  };

  return (
    <Modal
      show={isOpen}
      size="7xl"
      popup
      onClose={onClose}
      className="rounded-none backdrop-blur-"
    >
      <Modal.Body className="border-2 border-dark input-primary rounded-none p-10 custom-scroll-bar">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-dark dark:text-white">
                Update Profile
              </h3>
              <button onClick={onClose} className="bg-dark p-1.5 text-white">
                <IoMdClose />
              </button>
            </div>
            <div className="mt-3">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedProfile.name}
                onChange={handleChange}
                className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="skills" className="text-sm font-medium">
                Skills
              </label>
              <CreatableSelect
                id="skills"
                name="skills"
                styles={customStyles}
                className="input-primary placeholder:text-sm"
                isMulti
                value={skills} // Use skills state instead of updatedProfile.skills
                onChange={handleSkillsChange} // Use handleSkillsChange instead of handleChange
                onCreateOption={handleCreateSkills}
              />
            </div>

            <div className="mt-3">
              <label htmlFor="github" className="text-sm font-medium">
                GitHub
              </label>
              <input
                type="text"
                id="github"
                name="github"
                value={updatedProfile.github}
                onChange={handleChange}
                className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn
              </label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={updatedProfile.linkedin}
                onChange={handleChange}
                className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="facebook" className="text-sm font-medium">
                Facebook
              </label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={updatedProfile.facebook}
                onChange={handleChange}
                className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="portfolio" className="text-sm font-medium">
                Portfolio
              </label>
              <input
                type="text"
                id="portfolio"
                name="portfolio"
                value={updatedProfile.portfolio}
                onChange={handleChange}
                className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={updatedProfile.address}
                onChange={handleChange}
                className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="number" className="text-sm font-medium">
                Number
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={updatedProfile.number}
                onChange={handleChange}
                className="placeholder-text-black/25 placeholder:text-sm w-full  border-2 border-dark p-3.5 input-primary mt-2"
              />
            </div>
            {/* Add more fields for other profile details as needed */}
            <button
              type="submit"
              className="text-center text-sm w-full border border-dark py-3.5 border-dashed  flex items-center gap-3 justify-center button-primary bg-dark text-white"
            >
              Save
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

// PropTypes validation
UpdateProfileModal.propTypes = {
  profile: PropTypes.any.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UpdateProfileModal;

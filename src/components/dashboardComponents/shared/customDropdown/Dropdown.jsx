import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Dropdown = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center  rounded-md  bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 w-4"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={toggleDropdown}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="162"
            height="38"
            viewBox="0 0 162 38"
            fill="none"
          >
            <circle cx="19" cy="19" r="19" fill="#444444" />
            <circle cx="81" cy="19" r="19" fill="#444444" />
            <circle cx="143" cy="19" r="19" fill="#444444" />
          </svg>
        </button>
      </div>

      {/* Dropdown panel, show/hide based on dropdown state */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <button
              onClick={onEdit}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900 w-full text-left"
              role="menuitem"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default Dropdown;

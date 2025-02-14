import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const FiltersDropdown = ({ trigger, data, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [filters, setFilters] = useState({ status: "", priority: "" });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (filterType, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: filterValue,
    }));
  };

  return (
    <div
      ref={dropdownRef}
      className="flex flex-col justify-center items-center z-30"
    >
      <div className="flex items-center justify-center">
        <div className="relative text-left flex items-center justify-center">
          <button
            onClick={toggleDropdown}
            type="button"
            aria-haspopup="true"
            aria-expanded={isOpen ? "true" : "false"}
            aria-controls="dropdown-menu"
          >
            <span>{trigger}</span>
          </button>
          <div
            className={`${
              isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            } dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95`}
            id="dropdown-menu"
          >
            <div className="absolute right-0 w-96   mt-10 origin-top-right bg-white divide-y divide-gray-100 shadow-lg outline-none border-2 border-black input-primary">
              <div className="pb-6">
                <h2 className="text-lg mb-1 px-6 pt-6">{title}</h2>
                {data.length === 0 ? (
                  <p className="py-10 text-center opacity-45">
                    No {title} Available
                  </p>
                ) : (
                  <div className="px-6 pt-6">
                    <div className="mb-4">
                      <label>Status:</label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                      >
                        <option value="">All</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    <div>
                      <label>Priority:</label>
                      <select
                        value={filters.priority}
                        onChange={(e) =>
                          handleFilterChange("priority", e.target.value)
                        }
                      >
                        <option value="">All</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
FiltersDropdown.propTypes = {
  trigger: PropTypes.element.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      item_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default FiltersDropdown;

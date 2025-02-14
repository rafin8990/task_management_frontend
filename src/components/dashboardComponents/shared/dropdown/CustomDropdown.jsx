import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { RiDeleteBack2Line } from "react-icons/ri";
import useDeleteData from "../../hooks/useDeleteData";

const CustomDropdown = ({
  trigger,
  data,
  title,
  backgroundColor,
  refetchNotifications,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const deleteData = useDeleteData();

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

  const handleDeleteNotification = (id) => {
    console.log(id);
    deleteData(`/notifications/${id}`, refetchNotifications);
  };

  return (
    <div
      ref={dropdownRef}
      className="dark:text-white  flex flex-col justify-center items-center"
    >
      <div className="flex items-center justify-center">
        <div className="relative text-left flex items-center justify-center">
          <button
            className="bg-transparent rounded-full"
            onClick={toggleDropdown}
            type="button"
            aria-haspopup="true"
            aria-expanded={isOpen ? "true" : "false"}
            aria-controls="dropdown-menu"
          >
            <span className="bg-transparent rounded-full">{trigger}</span>
          </button>
          <div
            className={`${
              isOpen ? "opacity-100 visible " : "opacity-0 invisible"
            } dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95`}
            id="dropdown-menu"
          >
            <div className="absolute right-0 w-96   mt-10 origin-top-right bg-white dark:bg-dark divide-y divide-gray-100 shadow-lg outline-none border-2 border-black input-primary">
              <div className="pb-6">
                <h2 className="text-lg mb-1 px-6 pt-6">{title}</h2>
                {data.length === 0 ? (
                  <p className="py-10 text-center opacity-45">
                    No {title} Available
                  </p>
                ) : (
                  <div className="">
                    <ul>
                      {data.slice(-10).map((notification) => (
                        <li
                          key={notification?.id}
                          className="py-2 px-7 hover:bg-secondary dark:hover:bg-secondaryDark relative group"
                        >
                          {/* Delete icon */}
                          <button
                            onClick={() =>
                              handleDeleteNotification(notification?.id)
                            }
                            className="absolute top-4 right-4 text-red-600 w-5 h-5 text-xl opacity-0 group-hover:opacity-100"
                          >
                            <RiDeleteBack2Line />
                          </button>

                          {/* Notification content */}
                          <div className="grid grid-cols-12 items-start gap-6">
                            <div className="pt-1 w-7 h-7  col-span-1">
                              <img
                                style={{ backgroundColor }}
                                src={notification?.user_photo}
                                className="w-7 h-7 button-primary border border-black"
                                alt=""
                              />
                            </div>
                            <div className="col-span-11  ps-3">
                              <p className="">
                                <span className="font-semibold text-sm">
                                  {notification?.user_name}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(
                                    notification?.edit_time
                                  ).toLocaleString()}
                                </span>
                              </p>
                              <p className=" text-xs">
                                {notification?.message}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
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
CustomDropdown.propTypes = {
  trigger: PropTypes.element.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      item_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  refetchNotifications: PropTypes.func,
};

export default CustomDropdown;

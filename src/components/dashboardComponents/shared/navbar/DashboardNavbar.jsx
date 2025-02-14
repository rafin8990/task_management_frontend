import { Dropdown } from 'flowbite-react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import inboxIcon from '../../../../assets/icons/inbox.svg';
import notificationIcon from '../../../../assets/icons/notification.svg';
import { AuthContext } from '../../../context/auth/authProvider/AuthProvider';
import { useWorkspace } from '../../../context/workspace/WorkspaceContext';
import DateTimeDisplay from '../displayTimeAndDate/DateTimeDisplay';
import CustomDropdown from '../dropdown/CustomDropdown';

import { HiMiniMoon } from 'react-icons/hi2';
import { TbSunFilled } from 'react-icons/tb';

const DashboardNavbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const { notifications, refetchNotifications, isDarkMode, setIsDarkMode } = useWorkspace();

  const navigate = useNavigate();
  const handleLogOut = () => {
    navigate('/');
    signOutUser();
    localStorage.removeItem('accessToken');
  };
  const darkModeHandler = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <section className="sticky top-0 bg-white dark:bg-dark z-50">
      <div className="border-b-2 dark:border-secondaryDark pb-0.5 px-6 flex items-center justify-between">
        <div className="py-4">
          <DateTimeDisplay />
        </div>

        <div className="flex gap-3 items-center">
        
          <button
            onClick={() => darkModeHandler()}
            className={`w-10 h-10 p-1.5 border-2 border-dark dark:border-white bg-dark dark:bg-white text-white dark:text-dark text-xl rounded-full flex items-center justify-center`}
          >
            {isDarkMode ? <TbSunFilled /> : <HiMiniMoon />}
          </button>


          <div className=" xl:flex text-start rounded-lg bg-[white] dark:bg-dark dark:text-white">
            <Dropdown
              className="bg-white  w-[200px] rounded-lg text-start"
              inline
              label={
                <div className="flex items-start gap-3 ">
                  <div className="">
                    <img
                      src={user?.photoURL}
                      className="w-10 h-10 object-cover rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="text-start">
                    <h2 className="text-lg font-medium">{user?.displayName}</h2>
                    <p className="text-xs opacity-75">{user?.email}</p>
                  </div>
                </div>
              }
            >
              <Dropdown.Item className="mt-2">
                <Link href={'/dashboard'}>Dashboard</Link>
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Item>
                <button
                  onClick={() => handleLogOut()}
                  className="bg-red-600 text-white lg:text-[14px] w-full py-2 font-bold rounded-lg"
                >
                  Log Out
                </button>
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardNavbar;

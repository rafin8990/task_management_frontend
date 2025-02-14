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
    localStorage.removeItem('lastWorkspace');
  };
  const darkModeHandler = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };
  console.log(isDarkMode);

  return (
    <section className="sticky top-0 bg-white dark:bg-dark z-50">
      <div className="border-b-2 dark:border-secondaryDark pb-0.5 px-6 flex items-center justify-between">
        <div className="py-4">
          <DateTimeDisplay />
        </div>

        <div className="flex gap-3 items-center">
          {/* <div className="w-10 h-10 p-2.5  border-2 border-black rounded-full flex items-center justify-center text-2xl">

            <FiSearch />
          </div> */}
          <button
            onClick={() => darkModeHandler()}
            className={`w-10 h-10 p-1.5 border-2 border-dark dark:border-white bg-dark dark:bg-white text-white dark:text-dark text-xl rounded-full flex items-center justify-center`}
          >
            {isDarkMode ? <TbSunFilled /> : <HiMiniMoon />}
          </button>
          {/* NOTIFICATION */}
          <CustomDropdown
            trigger={
              <button
                className={`w-10 h-10 p-2.5  border-2 border-dark dark:border-white bg-dark dark:bg-white text-white dark:image-dark dark:rounded-full  rounded-full ${
                  !isDarkMode && 'icon-container active'
                } relative`}
              >
                <img className={` ${isDarkMode && 'image-dark'}`} src={notificationIcon} alt="" />
                {notifications.length >= 1 && (
                  <span className="absolute -top-1.5 bg-red-600 w-3.5 h-3.5 border-2 bg- border-white rounded-full right-0 "></span>
                )}
              </button>
            }
            title={'Notifications'}
            data={notifications}
            backgroundColor={'white'}
            refetchNotifications={refetchNotifications}
          />

          {/* INBOX */}
          <CustomDropdown
            trigger={
              <div
                className={`w-10 h-10 p-2.5  border-2 border-dark dark:border-white bg-dark dark:bg-white text-white dark:image-dark dark:rounded-full  rounded-full ${
                  !isDarkMode && 'icon-container active'
                } relative`}
              >
                <img className="" src={inboxIcon} alt="" />
              </div>
            }
            title={'Message'}
            data={[]}
          />

          {/* USER PROFILE  */}

          <div className=" xl:flex hidden  text-start rounded-lg bg-[white] dark:bg-dark dark:text-white">
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

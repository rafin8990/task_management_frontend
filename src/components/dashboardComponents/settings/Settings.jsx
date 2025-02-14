import { useContext, useState } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri';
import blackLogo from '../../../assets/logo.png';
import whiteLogo from '../../../assets/white-logo.png';
import { AuthContext } from '../../context/auth/authProvider/AuthProvider';
import { useWorkspace } from '../../context/workspace/WorkspaceContext';
import useDeleteData from '../hooks/useDeleteData';
import useDynamicData from '../hooks/useDynamicData';
import useUpdateData from '../hooks/useUpdateData';
import ConfirmationModal from '../modals/ConfirmationModal';
import UpdateProfileModal from '../modals/UpdateProfileModal';

import { updateProfile } from 'firebase/auth';
import auth from '../../../../firebase.config';
import WorkspaceDetailsModal from '../modals/WorkspaceDetailsModal';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { workspaces, activeWorkspace, refetchWorkspace } = useWorkspace();
  const [openModal, setOpenModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openWorkspaceDetailsModal, setOpenWorkspaceDetailsModal] = useState(false);
  const [deletedWorkspaceId, setDeletedWorkspaceId] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const { updateData } = useUpdateData();
  const deleteData = useDeleteData();

  const {
    data: userDetails,
    isLoading: userDetailsLoading,
    refetch: refetchUserDetails,
  } = useDynamicData(`/users/${user?.email}`, `/users/${user?.email}`);

  const handleDelete = () => {
    // Logic to delete task
    deleteData(`/workspaces/${deletedWorkspaceId}`, refetchWorkspace);
    setDeletedWorkspaceId('');
    console.log('workspace deleted!', deletedWorkspaceId);
  };

  const handleProfileUpdate = (updatedProfile) => {
    updateData(`/users/${user?.email}`, updatedProfile, (responseData, error) => {
      if (!error) {
        // Handle success
        refetchUserDetails();
        updateProfile(auth.currentUser, {
          displayName: updatedProfile.name,
        });
        console.log('Response:', responseData);
      } else {
        // Handle error

        console.error('Error:', error);
        // Display error message to the user
      }
    });
    refetchUserDetails();
    refetchUserDetails();
  };

  const handleOpenWorkspaceDetailsModal = () => {
    console.log(selectedWorkspace);
    // Handle edit functionality
    setOpenWorkspaceDetailsModal(true);
  };
  const handleCloseWorkspaceDetailsModal = () => {
    // Handle edit functionality
    setOpenWorkspaceDetailsModal(false);
  };

  return (
    <section>
      <div
        className={`flex items-start justify-between gap-6 p-4 relative overflow-hidden border-b-2 border-[#ffffff]`}
      >
        <div className="flex items-center justify-between ps-2">
          <img className={`h-40 absolute top-0 right-0 opacity-5 z-20 `} src={blackLogo} alt="" />
          {userDetailsLoading ? (
            <div className="flex items-center justify-center h-32 w-32 relative">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className={`inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-#ffffff`}
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img className="w-32 h-32 object-cover" src={userDetails?.image} alt="" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <label
                  htmlFor="upload"
                  className="bg-black bg-opacity-50 text-white px-4 py-2 cursor-pointer w-full h-full flex items-center justify-center text-sm border border-dashed border-white"
                >
                  <span> Upload Photo</span>
                </label>
                <input type="file" id="upload" className="hidden" />
              </div>
            </div>
          )}

          <div className="ms-8">
            <h2 className="text-4xl">{userDetails?.name}</h2>
            <h2 className="text-sm">{userDetails?.email}</h2>
          </div>
        </div>
        <button
          onClick={() => setOpenProfileModal(true)}
          className="  input-primary border font- py-2 px-4 rounded-none gap-2 text-sm me-4 z-40"
        >
          <p className="pt-0.5">Edit</p>
        </button>
      </div>

      <div className="grid grid-cols-4 h-[73vh] ">
        <div className="col-span-3 p-10 space-y-6">
          <div className="">
            <h3 className="text-xs font-semibold">Skills:</h3>
            <div className="flex items-center gap-1 mt-1">
              {userDetails &&
                userDetails?.skills?.map((skill, idx) => (
                  <p className=" bg-dark text-white px-4 py-1 text-xs" key={idx}>
                    {skill}
                  </p>
                ))}
            </div>
          </div>
          <div className="">
            <h3 className="text-xs font-semibold">Address:</h3>
            {userDetails && userDetails.address && (
              <div>
                <p>{userDetails.address}</p>
              </div>
            )}
          </div>
          <div className="">
            <h3 className="text-xs font-semibold">Number:</h3>
            {userDetails && userDetails.number && (
              <div>
                <p>{userDetails.number}</p>
              </div>
            )}
          </div>
          <div className="">
            <h3 className="text-xs font-semibold">Github Link:</h3>
            {userDetails && userDetails.github && (
              <div>
                <a href={userDetails.github}>{userDetails.github}</a>
              </div>
            )}
          </div>
          <div className="">
            <h3 className="text-xs font-semibold">LinkedIn Link:</h3>
            {userDetails && userDetails.linkedin && (
              <div>
                <a href={userDetails.linkedin}>{userDetails.linkedin}</a>
              </div>
            )}
          </div>
          <div className="">
            <h3 className="text-xs font-semibold">Facebook Link:</h3>
            {userDetails && userDetails.facebook && (
              <div>
                <a href={userDetails.facebook}>{userDetails.facebook}</a>
              </div>
            )}
          </div>
          <div className="">
            <h3 className="text-xs font-semibold">Portfolio Link:</h3>
            {userDetails && userDetails.portfolio && (
              <div>
                <a href={userDetails.portfolio}>{userDetails.portfolio}</a>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 p-10 h-full border-s">
          <div className="">
            <h3 className="text-xs font-semibold">Workspaces - </h3>
            {workspaces &&
              workspaces.map((workspace) => (
                <div
                  onClick={() => {
                    handleOpenWorkspaceDetailsModal(workspace.id);
                    setSelectedWorkspace(workspace);
                  }}
                  key={workspace?.id}
                  className="bg-secondary dark:bg-secondaryDark py-3.5 px-6 mt-2 relative flex items-center justify-between cursor-pointer overflow-hidden"
                >
                  <div className="">
                    <p className="capitalize">{workspace?.name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenModal(true);
                      setDeletedWorkspaceId(workspace?.id);
                    }}
                    className={`text-red-600 text-xl z-30 ${
                      activeWorkspace?.id === workspace?.id ? 'hidden ' : 'inline-block'
                    }`}
                  >
                    <RiCloseCircleFill className="z-20 " />
                  </button>
                  <img
                    className={`h-20 absolute -right-0 top-0 ${
                      activeWorkspace?.id === workspace?.id ? 'inline-block' : 'hidden'
                    }`}
                    src={whiteLogo}
                    alt=""
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={openModal && !!deletedWorkspaceId}
        onClose={() => {
          setOpenModal(false);
          setDeletedWorkspaceId('');
        }}
        message="Are you sure you want to delete this Workspace?"
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <UpdateProfileModal
        profile={userDetails}
        isOpen={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        onUpdate={handleProfileUpdate}
      />
      <WorkspaceDetailsModal
        textColor={'black'}
        workspace={selectedWorkspace}
        backgroundColor={'white'}
        isOpen={openWorkspaceDetailsModal}
        onClose={handleCloseWorkspaceDetailsModal}
      />
    </section>
  );
};

export default Settings;

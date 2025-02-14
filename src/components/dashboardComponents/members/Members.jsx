import { useContext, useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import blackLogo from '../../../assets/logo.png';
import { AuthContext } from '../../context/auth/authProvider/AuthProvider';
import { useWorkspace } from '../../context/workspace/WorkspaceContext';
import useDynamicData from '../hooks/useDynamicData';

import useUpdateData from '../hooks/useUpdateData';
import ConfirmationModal from '../modals/ConfirmationModal';

const Members = () => {
  const { user } = useContext(AuthContext);
  const { refetchWorkspace, sendWorkspaceMembersEmails, activeWorkspace, workspaceMembersData } =
    useWorkspace();
  const { updateData } = useUpdateData();
  const [selectedMember, setSelectedMember] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deletedMemberEmail, setDeletedMemberEmail] = useState('');

  const {
    data: userDetails,
    // isLoading: userDetailsLoading,
    // refetch: refetchUserDetails,
  } = useDynamicData(`/users/${user?.email}`, `/users/${user?.email}`);

  const handleDelete = () => {
    const updates = {
      members: activeWorkspace.members.filter((member) => member !== deletedMemberEmail),
    };
    updateData(`/workspaces/${activeWorkspace.id}`, updates, (responseData, error) => {
      if (!error) {
        // Handle success
        console.log('Response:', responseData);
        refetchWorkspace();
        setDeletedMemberEmail('');
        sendWorkspaceMembersEmails();
      } else {
        // Handle error
        refetchWorkspace();
        setDeletedMemberEmail('');
        console.error('Error:', error);
        // Display error message to the user
      }
      refetchWorkspace();
    });

    console.log('workspace deleted!', deletedMemberEmail);
  };

  return (
    <section>
      <div
        className={`flex items-start justify-between gap-6 px-4 py-10 relative overflow-hidden border-b-2 border-[#ffffff]`}
      >
        <img className={`h-40 absolute top-0 right-0 opacity-5 z-20 `} src={blackLogo} alt="" />
        <div className="flex items-center justify-between">
          <div className="ms-2.5">
            <h2 className="text-sm mb-1.5">Workspace Name -</h2>
            <h2 className="text-4xl font-light capitalize">
              {activeWorkspace?.name}&#39; Workspace Members Details
            </h2>
          </div>
        </div>
        <div className="me-8">
          <h2 className="text-sm mb-1 font-semibold opacity-50">Workspace Created At -</h2>
          <h2 className="font-semibold">
            {activeWorkspace?.created_at
              ? new Date(activeWorkspace.created_at).toLocaleDateString()
              : ''}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-4 h-[73vh] ">
        <div className="col-span-1 py-7 h-full border-e">
          <div className="">
            <h3 className="text-xs font-semibold px-7 pb-4">Members - </h3>
            {workspaceMembersData &&
              workspaceMembersData?.map((member) => (
                <div
                  onClick={() => setSelectedMember(member)}
                  key={member?.id}
                  className="bg-secondary dark:bg-secondaryDark cursor-pointer mt-2 relative flex items-center justify-between overflow-y-hidden ps-4"
                >
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
                  <button
                    onClick={() => {
                      setOpenModal(true);
                      setDeletedMemberEmail(member?.email);
                    }}
                    className={`h-[4.1rem] text-white text-xl w-12 bg-black hover:bg-red-600 flex items-center justify-center ${
                      member?.email === activeWorkspace.creator ||
                      user.email !== activeWorkspace.creator
                        ? 'hidden'
                        : 'inline-block'
                    } `}
                  >
                    <VscChromeClose />
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="col-span-3 p-7 space-y-6">
          {selectedMember ? (
            <div>
              <h3 className="text-xs font-semibold px- pb-4">
                {selectedMember.name ? `${selectedMember.name}' Details -` : 'Member Details -'}{' '}
              </h3>
              <div className="mt-2 flex items-center gap-6">
                <img className="w-32 h-32 object-cover" src={selectedMember?.image} alt="" />
                <div className="">
                  <h2 className="text-4xl mb-1">{selectedMember?.name}</h2>
                  <h2 className="text-sm">
                    Email: <span className="opacity-75">{selectedMember?.email}</span>
                  </h2>
                </div>
              </div>
              <div className="col-span-3 p-10 space-y-6">
                <div className="">
                  <h3 className="text-xs font-semibold">Skills:</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {JSON.parse(selectedMember.skills).map((skill, idx) => (
                      <p className=" bg-dark text-white px-4 py-1 text-xs" key={idx}>
                        {skill}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="">
                  <h3 className="text-xs font-semibold">Address:</h3>
                  {selectedMember && selectedMember.address && (
                    <div>
                      <p>{selectedMember.address}</p>
                    </div>
                  )}
                </div>
                <div className="">
                  <h3 className="text-xs font-semibold">Number:</h3>
                  {selectedMember && selectedMember.number && (
                    <div>
                      <p>{selectedMember.number}</p>
                    </div>
                  )}
                </div>
                <div className="">
                  <h3 className="text-xs font-semibold">Github Link:</h3>
                  {selectedMember && selectedMember.github && (
                    <div>
                      <a href={selectedMember.github}>{selectedMember.github}</a>
                    </div>
                  )}
                </div>
                <div className="">
                  <h3 className="text-xs font-semibold">LinkedIn Link:</h3>
                  {selectedMember && selectedMember.linkedin && (
                    <div>
                      <a href={selectedMember.linkedin}>{selectedMember.linkedin}</a>
                    </div>
                  )}
                </div>
                <div className="">
                  <h3 className="text-xs font-semibold">Facebook Link:</h3>
                  {selectedMember && selectedMember.facebook && (
                    <div>
                      <a href={selectedMember.facebook}>{selectedMember.facebook}</a>
                    </div>
                  )}
                </div>
                <div className="">
                  <h3 className="text-xs font-semibold">Portfolio Link:</h3>
                  {selectedMember && selectedMember.portfolio && (
                    <div>
                      <a href={selectedMember.portfolio}>{selectedMember.portfolio}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <h3 className="text-xs font-semibold px- pb-4">Member Details -</h3>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        message="Are you sure you want to delete this Member?"
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
};

export default Members;

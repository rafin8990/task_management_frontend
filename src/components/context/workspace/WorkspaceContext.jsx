import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useDynamicData from "../../dashboardComponents/hooks/useDynamicData";
import { AuthContext } from "../auth/authProvider/AuthProvider";
import useAxios from "../../dashboardComponents/hooks/useAxios";

const WorkspaceContext = createContext();

export const useWorkspace = () => {
  return useContext(WorkspaceContext);
};

export const WorkspaceProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxios();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [workspaceMembersData, setWorkspaceMembersData] = useState([]);

  console.log(activeWorkspace);

  const { data: workspaces = [], refetch: refetchWorkspace } = useQuery({
    queryKey: ["workspaces", activeWorkspace],
    enabled: !!user,
    queryFn: () =>
      axios
        .get(
          `http://localhost:3000/api/workspaces/workspaces-by-members-id/${user?.email}`
          // `https://task.bamsbd.com/api/workspaces/workspaces-by-members-id/${user?.email}`
        )
        .then((res) => res.data),
  });

  // Fetch tasks for active workspace
  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useDynamicData(
    `tasks-${activeWorkspace ? activeWorkspace.id : ""}`,
    activeWorkspace ? `/tasks/workspace/${activeWorkspace.id}` : null
  );
  const {
    data: notifications,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useDynamicData(
    `notifications-${activeWorkspace ? activeWorkspace.id : ""}`,
    activeWorkspace ? `/notifications/workspace/${activeWorkspace.id}` : null
  );
  const {
    data: totalCompletedTasks,
    isLoading: totalCompletedTasksLoading,
    refetch: refetchTotalCompletedTasks,
  } = useDynamicData(
    `tasks-complete-task-count-${activeWorkspace ? activeWorkspace.id : ""}`,
    activeWorkspace ? `/tasks/complete-task-count/${activeWorkspace.id}` : null
  );
  const {
    data: workspaceCreatorDetails,
    isLoading: workspaceCreatorDetailsLoading,
    refetch: refetchWorkspaceCreatorDetails,
  } = useDynamicData(
    `users-${activeWorkspace ? activeWorkspace.creator : ""}`,
    activeWorkspace ? `/users/${activeWorkspace.creator}` : null
  );
  const {
    data: taskStatusData,
    isLoading: taskStatusDataLoading,
    refetch: refetchTaskStatusData,
  } = useDynamicData(
    `tasks-task-status-${activeWorkspace ? activeWorkspace.id : ""}`,
    activeWorkspace ? `/tasks/task-status/${activeWorkspace.id}` : null
  );

  const sendWorkspaceMembersEmails = async () => {
    try {
      const response = await axiosPublic.post("/tasks/members-details", {
        taskMembersEmails: activeWorkspace?.members,
      });

      setWorkspaceMembersData(response.data);
    } catch (error) {
      console.error("Error fetching task members' details:", error);
    }
  };

  // Set active workspace
  useEffect(() => {
    // Check if user has set a workspace previously
    const lastWorkspace = localStorage.getItem("lastWorkspace");

    if (lastWorkspace && workspaces.length > 0 && !activeWorkspace) {
      const foundWorkspace = workspaces.find(
        (workspace) => workspace.id === lastWorkspace
      );
      if (foundWorkspace) {
        setActiveWorkspace(foundWorkspace);
        refetchTotalCompletedTasks();
      } else {
        console.error("Last workspace not found.");
      }
    }

    // Set default workspace to "personal" if no last workspace found
    if (!activeWorkspace && workspaces.length > 0 && !lastWorkspace) {
      const defaultWorkspace = workspaces.find(
        (workspace) => workspace.name === "personal"
      );
      if (defaultWorkspace) {
        setActiveWorkspace(defaultWorkspace);
        refetchTotalCompletedTasks();
        localStorage.setItem("lastWorkspace", defaultWorkspace.id);
      } else {
        console.error("Default workspace 'personal' not found.");

        // If 'personal' workspace not found, set a random workspace as active
        const randomWorkspaceIndex = Math.floor(
          Math.random() * workspaces.length
        );
        const randomWorkspace = workspaces[randomWorkspaceIndex];
        setActiveWorkspace(randomWorkspace);
        refetchTotalCompletedTasks();
        localStorage.setItem("lastWorkspace", randomWorkspace.id);
      }
    }
    sendWorkspaceMembersEmails();
  }, [workspaces, activeWorkspace, refetchTotalCompletedTasks, user]);

  const switchWorkspace = (workspaceId) => {
    const workspace = workspaces.find(
      (workspace) => workspace.id === workspaceId
    );
    if (workspace) {
      setActiveWorkspace(workspace);
      refetchWorkspace();
      // Store the selected workspace in localStorage
      localStorage.setItem("lastWorkspace", workspaceId);
    } else {
      console.error("Workspace not found");
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        switchWorkspace,
        refetchWorkspace,
        tasks,
        tasksLoading,
        refetchTasks,
        totalCompletedTasks,
        totalCompletedTasksLoading,
        refetchTotalCompletedTasks,
        workspaceMembersData,
        sendWorkspaceMembersEmails,
        workspaceCreatorDetails,
        workspaceCreatorDetailsLoading,
        refetchWorkspaceCreatorDetails,
        taskStatusData,
        taskStatusDataLoading,
        refetchTaskStatusData,
        notifications,
        notificationsLoading,
        refetchNotifications,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

WorkspaceProvider.propTypes = {
  children: PropTypes.node,
};

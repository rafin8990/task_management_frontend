import { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { useWorkspace } from "../../context/workspace/WorkspaceContext";
import { AuthContext } from "../../context/auth/authProvider/AuthProvider";
import useAxios from "../hooks/useAxios";
import { MdSend } from "react-icons/md";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const Inbox = () => {
  const { activeWorkspace } = useWorkspace();
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [seenMessages, setSeenMessages] = useState(new Set());

  const messagesEndRef = useRef(null);
  const axiosPublic = useAxios();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosPublic.get(
          `/messages/${activeWorkspace.id}`
        );
        const messagesWithSeen = response.data.map((msg) => ({
          ...msg,
          seenBy: JSON.parse(msg.seen_by || "[]"),
        }));
        setMessages(
          messagesWithSeen.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          )
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (message) => {
      if (message.workspaceId === activeWorkspace.id) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, { ...message, seenBy: [] }];
          return updatedMessages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
        });
      }
    });

    socket.on("messageSeen", ({ messageId, user, user_email, user_image }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                seenBy: [
                  ...msg.seenBy,
                  { messageId, user, user_email, user_image },
                ],
              }
            : msg
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSeen");
    };
  }, [activeWorkspace, user]);

  useEffect(() => {
    messagesEndRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  const sendMessage = () => {
    const message = {
      user: user.displayName,
      user_image: user.photoURL,
      text: newMessage,
      workspaceId: activeWorkspace.id,
    };
    socket.emit("sendMessage", message);
    setNewMessage("");
  };

  const handleSeen = (messageId) => {
    if (!seenMessages.has(messageId)) {
      socket.emit("messageSeen", {
        messageId,
        user: user.displayName,
        user_email: user.email,
        user_image: user.photoURL,
      });
      setSeenMessages((prevSeenMessages) =>
        new Set(prevSeenMessages).add(messageId)
      );
    }
  };

  const handleScroll = () => {
    const messagesContainer = document.querySelector(".messages");
    if (!messagesContainer) return;

    const messagesElements = messagesContainer.children;
    for (const msgElement of messagesElements) {
      const messageId = msgElement.getAttribute("data-id");
      if (messageId && isElementInViewport(msgElement)) {
        handleSeen(messageId);
      }
    }
  };

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-dark flex flex-col items-center p-3">
      <div
        className="messages w-full bg-white dark:bg-secondaryDark shadow-md rounded-0 border-2 border-black p-4 pe-1 overflow-auto custom-scroll-bar"
        style={{ height: "80vh" }}
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            data-id={msg.id}
            className={`flex w-full mb-2 ${
              msg.user === user.displayName ? "justify-end" : "justify-start"
            }`}
          >
            <div className="">
              <p className=" text-[10px] opacity-50 ps-10">
                {msg.user === user.displayName ? "" : msg.user}
              </p>

              <div
                className={` items-end gap-2 ${
                  msg.user === user.displayName
                    ? "flex flex-row-reverse"
                    : "flex"
                }`}
              >
                <div className="">
                  <img
                    className={`w-8 h-8 rounded-full ${
                      msg.user === user.displayName ? "hidden" : "inline-block"
                    }`}
                    src={msg?.user_image}
                    alt={msg.user}
                  />
                </div>
                <div
                  className={`inline-block py-2 px-3 rounded-0 max-w-4xl ${
                    msg.user === user.displayName
                      ? "bg-dark dark:bg-white dark:text-secondaryDark text-white text-right rounded-s-md rounded-t-md"
                      : "bg-gray-200 text-black text-left rounded-e-md rounded-t-md"
                  }`}
                >
                  <p className="text-sm ">{msg.message}</p>
                </div>
              </div>
              {index === messages.length - 1 && (
                <p
                  className={`text-xs mt-1 ps-10 ${
                    msg.user === user.displayName ? "text-end" : "text-start"
                  }`}
                >
                  {msg.seenBy && msg.seenBy.length > 0 && (
                    <>
                      {msg.seenBy.map((seen, index) => (
                        <img
                          key={index}
                          src={seen.user_image}
                          alt={seen.user_email}
                          className="inline-block h-3 w-3 rounded-full ml-1"
                          title={seen.user_email}
                        />
                      ))}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="new-message w-full flex mt-2 space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message"
          className="w-full border-2 dark:bg-secondaryDark dark:border-secondaryDark border-dark p-2.5 input-primary mt-2 placeholder:text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-black  text-white border-2 border-dark dark:border-secondaryDark p-3.5 button-primary h-full text-sm mt-2 flex items-center justify-center gap-2"
        >
          <span>Send </span>
          <MdSend />
        </button>
      </div>
    </div>
  );
};

export default Inbox;

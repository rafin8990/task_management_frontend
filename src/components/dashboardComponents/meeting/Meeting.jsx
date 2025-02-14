import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Meeting = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const meetingDetails = { title, date, time };

    // Send meeting details to the backend via Socket.io
    if (socket) {
      socket.emit("create-meeting", meetingDetails, (response) => {
        if (response.success) {
          setMessage(
            `Meeting created successfully! Link: ${response.meetingLink}`
          );
        } else {
          setMessage(`Error: ${response.message}`);
        }
      });
    }
  };

  useEffect(() => {
    const socket = socketIOClient("http://localhost:3000");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Create Meeting</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Meeting</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Meeting;

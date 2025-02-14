import { useState, useEffect } from "react";

const useDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear the interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []); // Run this effect only once on component mount

  const getCurrentTime = () => {
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    return currentDateTime.toLocaleTimeString(undefined, options);
  };

  const getCurrentDate = () => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return currentDateTime.toLocaleDateString(undefined, options);
  };

  const getCurrentDay = () => {
    const options = { weekday: "long" };
    return currentDateTime.toLocaleDateString(undefined, options);
  };

  return {
    currentTime: getCurrentTime(),
    currentDate: getCurrentDate(),
    currentDay: getCurrentDay(),
  };
};

export default useDateTime;

import { useEffect, useState } from "react";

const useGreeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning!");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon!");
    } else {
      setGreeting("Good evening!");
    }
  }, []);

  return greeting;
};

export default useGreeting;

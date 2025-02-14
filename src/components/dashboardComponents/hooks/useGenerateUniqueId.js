import { useEffect, useState } from "react";

const useGenerateUniqueId = () => {
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    const generateUniqueId = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const idLength = 12;
      let newUniqueId = "";

      for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        newUniqueId += characters[randomIndex];
      }

      newUniqueId = newUniqueId.toUpperCase();
      return newUniqueId;
    };

    const newUniqueId = generateUniqueId();
    setUniqueId(newUniqueId);
  }, []); // Empty dependency array ensures the effect runs only once

  return uniqueId;
};

export default useGenerateUniqueId;

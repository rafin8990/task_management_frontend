import { useState } from "react";
import useAxios from "./useAxios";
import toast from "react-hot-toast";

const useUpdateData = () => {
  const [error, setError] = useState(null);
  const axiosPatch = useAxios();

  const updateData = (url, data, callback) => {
    axiosPatch
      .patch(url, data)
      .then((res) => {
        console.log(res);

        if (callback && typeof callback === "function") {
          callback(res.data, null);
        }
      })
      .catch((err) => {
        console.error("Error updating data: ", err);
        console.log("error to add", err?.response?.data?.error);
        toast.error(err?.response?.data?.error);
        setError(err); // Set the error state

        if (callback && typeof callback === "function") {
          callback(null, err);
        }
      });
  };

  return { updateData, error };
};

export default useUpdateData;

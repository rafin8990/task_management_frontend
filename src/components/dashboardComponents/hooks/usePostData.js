import { useState } from "react";
import useAxios from "./useAxios";
import toast from "react-hot-toast";

const usePostData = () => {
  const [error, setError] = useState(null);
  const axiosPost = useAxios();

  const postData = (url, data, callback) => {
    axiosPost
      .post(url, data)
      .then((res) => {
        console.log(res);
        if (callback && typeof callback === "function") {
          callback(res.data, null);
        }
      })
      .catch((err) => {
        console.log("error to add", { error }, err?.response?.data?.error);
        toast.error(err?.response?.data?.error);
        setError(err); // Set the error state
        if (callback && typeof callback === "function") {
          callback(null, err);
        }
      });
  };

  return { postData, error };
};

export default usePostData;

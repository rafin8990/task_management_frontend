import toast from "react-hot-toast";
import useAxios from "./useAxios";

const useDeleteData = () => {
  const axiosDelete = useAxios();
  const deleteData = (url, refetch) => {
    axiosDelete
      .delete(url)
      .then((res) => {
        console.log(res);
        if (refetch) {
          refetch();
        }
      })

      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };
  return deleteData;
};

export default useDeleteData;

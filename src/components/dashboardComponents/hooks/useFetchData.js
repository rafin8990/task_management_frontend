import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useFetchData = (queryKey, url) => {
  const axiosInstance = useAxios();
  
  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await axiosInstance.get(url);
      return response;
    },
  });

  return { data, isLoading, refetch };
};

export default useFetchData;

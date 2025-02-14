import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useDynamicData = (queryKey, url) => {
  const axiosAdmin = useAxios();
  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await axiosAdmin.get(url);
      return response.data;
    },
  });
  return { data, isLoading, refetch };
};
export default useDynamicData;

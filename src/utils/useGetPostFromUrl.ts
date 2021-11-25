import { useGetIntId } from "./useGetIntId";
import { usePostQuery } from "../generated/graphql";

export const useGetPostFromUrl = () => {
  const id = useGetIntId();
  return usePostQuery({
    skip: id === -1,
    variables: {
      id: id,
    },
  });
};

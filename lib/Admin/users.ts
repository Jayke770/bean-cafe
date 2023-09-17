import useSWR from "swr";
import { UserModel } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface User extends UserModel {
  _id: string;
}
export default function Users(skip?: string | number): {
  users: User[];
  usersLoading: boolean;
  usersError: boolean;
} {
  const { data, error, isLoading } = useSWR(
    `/api/dashboard/users?skip=${skip ?? 0}`,
    fetcher,
    {
      shouldRetryOnError: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
      refreshInterval: 10000
    }
  );
  return {
    users: data,
    usersLoading: isLoading,
    usersError: error,
  };
}

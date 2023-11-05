import useSWR from "swr";
import { Orders, UserModel, UserCart } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface User extends UserModel {
  _id: string;
}
export function Users(skip?: string | number): { users: User[]; usersLoading: boolean; usersError: boolean; } {
  const { data, error, isLoading } = useSWR(
    `/api/dashboard/users?skip=${skip ?? 0}`,
    fetcher,
    {
      shouldRetryOnError: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: true
    }
  );
  return {
    users: data,
    usersLoading: isLoading,
    usersError: error,
  };
}
export function UserInfo(id?: string): { userInfo: User; userInfoLoading: boolean; userInfoError: boolean; } {
  const { data, error, isLoading } = useSWR(
    id ? `/api/dashboard/users?type=user-info&id=${id}` : null,
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
    userInfo: data,
    userInfoLoading: isLoading,
    userInfoError: error,
  };
}
export function UserOrders(id?: string): { userOrders: Orders[]; userOrdersLoading: boolean; userOrdersError: boolean; } {
  const { data, error, isLoading } = useSWR(
    id ? `/api/dashboard/users?type=user-orders&id=${id}` : null,
    fetcher,
    {
      shouldRetryOnError: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: true
    }
  );
  return {
    userOrders: data,
    userOrdersLoading: isLoading,
    userOrdersError: error,
  };
}
export function UserCart(id?: string): { userCart: UserCart[]; userCartLoading: boolean; userCartError: boolean; } {
  const { data, error, isLoading } = useSWR(
    id ? `/api/dashboard/users?type=user-cart&id=${id}` : null,
    fetcher,
    {
      shouldRetryOnError: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: true
    }
  );
  return {
    userCart: data,
    userCartLoading: isLoading,
    userCartError: error,
  };
}
import useSWR from "swr";
import { AddOns } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface Addon extends AddOns {
  _id: string;
}
export default function AddOns(skip?: string | number): {
  addons: Addon[];
  addonsLoading: boolean;
  addonsError: boolean;
} {
  const { data, error, isLoading } = useSWR(
    `/api/admin/items/addon?skip=${skip ?? 0}`,
    fetcher,
    {
      shouldRetryOnError: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
    }
  );
  return {
    addons: data,
    addonsLoading: isLoading,
    addonsError: error,
  };
}

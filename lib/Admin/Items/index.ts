import useSWR from "swr";
import { Items } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface Item extends Items {
  _id: string;
}
export default function Items(skip?: string | number): {
  items: Item[];
  itemsLoading: boolean;
  itemsError: boolean;
} {
  const { data, error, isLoading } = useSWR(
    `/api/admin/items?skip=${skip ?? 0}`,
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
    items: data,
    itemsLoading: isLoading,
    itemsError: error,
  };
}

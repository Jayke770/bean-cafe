import useSWR from "swr";
import { Items } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
export default function Items(
  category?: string,
  skip?: 0
): {
  items: Items[];
  itemsLoading: boolean;
  itemsError: boolean;
} {
  const { data, error, isLoading } = useSWR(
    `/api/user/items?category=${category ?? "all"}&skip=${skip ?? 0}`,
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
    items: data,
    itemsLoading: isLoading,
    itemsError: error,
  };
}

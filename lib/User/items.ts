import useSWR from "swr";
import { Items } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
export default function Items({ category, search, skip }: { category?: string, skip?: 0, search?: string }): {
  items: Items[];
  itemsLoading: boolean;
  itemsError: boolean;
} {
  let endpoint = `/api/user/items?category=${category ?? "all"}&skip=${skip ?? 0}`
  if (search) endpoint += `&search=${search}`
  const { data, error, isLoading } = useSWR(endpoint,
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

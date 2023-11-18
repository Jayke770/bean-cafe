import useSWR from "swr";
import { Items as IItems } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface Item extends IItems {
  _id: string;
}
export function Items({ skip, category }: { skip?: string | number, category?: string }): {
  items: Item[];
  itemsLoading: boolean;
  itemsError: boolean;
} {
  const { data, error, isLoading } = useSWR(
    `/api/dashboard/items?skip=${skip ?? 0}&category=${category ?? "all"}`,
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
export function ItemInfo(id?: string): {
  item: Item;
  itemLoading: boolean;
  itemError: boolean;
  mutate: () => void
} {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/dashboard/items?id=${id}` : null,
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
    mutate,
    item: data,
    itemLoading: isLoading,
    itemError: error,
  };
}
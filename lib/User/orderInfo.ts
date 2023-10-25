import useSWR from "swr";
import { Orders } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
export default function OrderInfo(id?: string | null): {
    orderData?: Orders;
    orderDataLoading: boolean;
    orderDataError: boolean;
    mutate: () => void
} {
    const { data, error, isLoading, mutate } = useSWR(id ? `/api/user/items/orders?id=${id}` : null, fetcher,
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
        mutate,
        orderData: data,
        orderDataLoading: isLoading,
        orderDataError: error,
    };
}

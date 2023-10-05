import useSWR from "swr";
import { Orders } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
export default function OrdersData(status?: Orders['status']): {
    ordersData?: {
        total_orders: number,
        orders: Orders[]
    }; ordersDataLoading: boolean; ordersDataError: boolean;
} {
    const { data, error, isLoading } = useSWR(`/api/user/items/orders?status=${status ?? "all"}`, fetcher,
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
        ordersData: data,
        ordersDataLoading: isLoading,
        ordersDataError: error,
    };
}

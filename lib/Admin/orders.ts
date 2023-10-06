import useSWR from "swr";
import type { OrderStatus, Orders } from '@/types'
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface Stats {
    completed: number,
    cancelled: number
    denied: number
    pending: number
}
export function OrderStats(): {
    orderstats: Stats;
    orderstatsLoading: boolean;
    orderstatsError: boolean;
} {
    const { data, error, isLoading } = useSWR("/api/dashboard/orders?type=stats", fetcher, {
        shouldRetryOnError: true,
        revalidateOnMount: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
    });
    return {
        orderstats: data,
        orderstatsLoading: isLoading,
        orderstatsError: error,
    };
}
export function Orders(status?: OrderStatus | "all"): {
    orders?: Orders[];
    ordersLoading: boolean;
    ordersError: boolean;
} {
    const { data, error, isLoading } = useSWR(`/api/dashboard/orders?type=orders&status=${status ?? "pending"}`, fetcher, {
        shouldRetryOnError: true,
        revalidateOnMount: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
    });
    return {
        orders: data,
        ordersLoading: isLoading,
        ordersError: error,
    };
}
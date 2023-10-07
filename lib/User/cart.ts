import useSWR from "swr";
import { UserCart } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
export default function Cart(): { cartData?: UserCart[]; cartDataLoading: boolean; cartDataError: boolean; mutate: () => void } {
    const { data, error, isLoading, mutate } = useSWR('/api/user/cart', fetcher,
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
        cartData: data,
        cartDataLoading: isLoading,
        cartDataError: error,
    };
}

import useSWR from "swr";
import { UserCart } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
export default function Cart(): { cartData?: UserCart[]; cartDataLoading: boolean; cartDataError: boolean; } {
    const { data, error, isLoading } = useSWR('/api/user/cart', fetcher,
        {
            shouldRetryOnError: true,
            revalidateOnMount: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshWhenHidden: true,
            refreshWhenOffline: true,
            refreshInterval: 5000
        }
    );
    return {
        cartData: data,
        cartDataLoading: isLoading,
        cartDataError: error,
    };
}

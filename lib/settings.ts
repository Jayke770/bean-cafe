import useSWR from "swr";
import { settings } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
export default function Settings(): { settings?: settings; settingsLoading: boolean; settingsError: boolean } {
    const { data, error, isLoading, mutate } = useSWR('/api/settings', fetcher,
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
        settings: data,
        settingsLoading: isLoading,
        settingsError: error,
    };
}

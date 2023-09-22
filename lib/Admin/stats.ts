import useSWR from "swr";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface Stats {
  items: number;
  users: number;
  orders: number
}
export default function Stats(): {
  stats: Stats;
  statsLoading: boolean;
  statsError: boolean;
} {
  const { data, error, isLoading } = useSWR("/api/dashboard/stats", fetcher, {
    shouldRetryOnError: true,
    revalidateOnMount: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenHidden: true,
    refreshWhenOffline: true,
  });
  return {
    stats: data,
    statsLoading: isLoading,
    statsError: error,
  };
}

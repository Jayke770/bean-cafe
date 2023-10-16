import useSWR from "swr";
import { CategoriesType } from "@/types";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface CategoriesTypeExtended extends CategoriesType {
    _id: string
}
export default function Categories(): { categories?: CategoriesTypeExtended[]; categoriesLoading: boolean; categoriesError: boolean, mutate: () => void } {
    const { data, error, isLoading, mutate } = useSWR('/api/categories', fetcher,
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
        mutate: mutate,
        categories: data,
        categoriesLoading: isLoading,
        categoriesError: error,
    };
}

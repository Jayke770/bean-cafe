import useSWR from "swr";
import type { ReportData } from '@/types'
const fetcher = (url: any) => fetch(url).then((res) => res.json());
interface UsersReport {
    users: number,
    date: string
}
interface OrdersReport {
    orders: number,
    date: string
}
interface RevenueReport {
    date: string,
    revenue: number
}
export function UsersReport(report_data: ReportData): {
    usersReport: UsersReport[];
    usersReportLoading: boolean;
    usersReportError: boolean;
} {
    const { data, error, isLoading } = useSWR(`/api/dashboard/reports?type=users&data=${report_data ?? "daily"}`, fetcher, {
        shouldRetryOnError: true,
        revalidateOnMount: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
    });
    return {
        usersReport: data,
        usersReportLoading: isLoading,
        usersReportError: error,
    };
}
export function OrdersReport(report_data: ReportData): {
    ordersReport: OrdersReport[];
    ordersReportLoading: boolean;
    ordersReportError: boolean;
} {
    const { data, error, isLoading } = useSWR(`/api/dashboard/reports?type=orders&data=${report_data ?? "daily"}`, fetcher, {
        shouldRetryOnError: true,
        revalidateOnMount: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
    });
    return {
        ordersReport: data,
        ordersReportLoading: isLoading,
        ordersReportError: error,
    };
}
export function RevenueReport(report_data: ReportData): {
    revenueReport: RevenueReport[];
    revenueReportLoading: boolean;
    revenueReportError: boolean;
} {
    const { data, error, isLoading } = useSWR(`/api/dashboard/reports?type=revenue&data=${report_data ?? "daily"}`, fetcher, {
        shouldRetryOnError: true,
        revalidateOnMount: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshWhenOffline: true,
    });
    return {
        revenueReport: data,
        revenueReportLoading: isLoading,
        revenueReportError: error,
    };
}
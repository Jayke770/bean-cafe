import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button, Card, Checkbox, Dialog, List, ListItem, Popover, Radio } from 'konsta/react';
import { OrdersReport, UsersReport } from '@lib/Admin/reports'
import { FaSort } from 'react-icons/fa';
import { useLocalstorageState } from 'rooks';
import type { ReportData } from '@/types'
import * as changeCase from 'change-case'
import moment from 'moment-timezone';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
interface ReportDataType {
    users: ReportData,
    open?: "users" | "orders"
    orders: ReportData
}
export default function Charts() {
    const [reportType, setReportType] = useLocalstorageState<ReportDataType>("report-type", { orders: "daily", users: "daily" })
    const { ordersReport } = OrdersReport(reportType?.orders)
    const { usersReport } = UsersReport(reportType?.users)
    const onTogglePopOver = (data: any) => setReportType(e => ({ ...e, open: data }))
    return (
        <>
            <div className='flex flex-col px-4 gap-2'>
                <h1 className='text-xl font-bold'>Reports</h1>
                <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-2 '>
                    <Card
                        margin='m-0'
                        className=' k-color-brand-primary'>
                        <div className='flex flex-col gap-2.5'>
                            <div className='flex justify-between items-baseline'>
                                <div className='text-lg font-medium'>Orders</div>
                                <Button
                                    onClick={() => onTogglePopOver("orders")}
                                    small
                                    clear
                                    tonal
                                    className="!w-auto flex items-center gap-2">
                                    {changeCase.sentenceCase(reportType?.orders ?? "")}
                                    <FaSort />
                                </Button>
                            </div>
                            <div className='w-full h-full'>
                                <Bar
                                    options={{
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                    }}
                                    data={{
                                        labels: ordersReport?.map(x => {
                                            let date = x.date
                                            if (reportType?.orders === "daily") date = moment(x.date).format('MMM DD')
                                            if (reportType?.orders === "monthly") date = moment(x.date).format('MMM')
                                            if (reportType?.orders === "yearly") date = moment(x.date).format('YYYY')
                                            return date
                                        }),
                                        datasets: [
                                            {
                                                label: 'Orders',
                                                data: ordersReport?.map(x => (x.orders)),
                                                backgroundColor: "#cc9c68"
                                            }
                                        ]
                                    }} />
                            </div>
                        </div>
                    </Card>
                    <Card
                        margin='m-0'
                        className=' k-color-brand-primary'>
                        <div className='flex flex-col gap-2.5'>
                            <div className='flex justify-between items-baseline'>
                                <div className='text-lg font-medium'>Users</div>
                                <Button
                                    onClick={() => onTogglePopOver("users")}
                                    small
                                    clear
                                    tonal
                                    className="!w-auto flex items-center gap-2">
                                    {changeCase.sentenceCase(reportType?.users ?? "")}
                                    <FaSort />
                                </Button>
                            </div>
                            <div className='w-full h-full'>
                                <Bar
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                    }}
                                    data={{
                                        labels: usersReport?.map(x => {
                                            let date = x.date
                                            if (reportType?.users === "daily") date = moment(x.date).format('MMM DD')
                                            if (reportType?.users === "monthly") date = moment(x.date).format('MMM')
                                            if (reportType?.users === "yearly") date = moment(x.date).format('YYYY')
                                            return date
                                        }),
                                        datasets: [
                                            {
                                                label: 'Users',
                                                data: usersReport?.map(x => (x.users)),
                                                backgroundColor: "#cc9c68"
                                            }
                                        ]
                                    }} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Dialog
                opened
                onBackdropClick={onTogglePopOver}
                className=' k-color-brand-primary'>
                {/* <List margin='my-0' nested>
                    <ListItem
                        link
                        title="Daily"
                        chevron={false}
                        media={<Radio readOnly className=' pointer-events-none' />} />
                    <ListItem
                        link
                        title="Monthly"
                        chevron={false}
                        media={<Radio readOnly className=' pointer-events-none' />} />
                    <ListItem
                        link
                        title="Yearly"
                        chevron={false}
                        media={<Radio readOnly className=' pointer-events-none' />} />
                </List> */}
            </Dialog>
        </>
    )
}
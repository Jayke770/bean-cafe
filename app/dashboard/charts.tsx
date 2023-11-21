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
import { Button, Card, List, ListItem, Popover, Radio } from 'konsta/react';
import { OrdersReport, UsersReport, RevenueReport } from '@lib/Admin/reports'
import { FaSort } from 'react-icons/fa';
import type { ReportData } from '@/types'
import * as changeCase from 'change-case'
import moment from 'moment-timezone';
import { useState } from 'react';
import { REPORT_TYPES } from '@lib/constants'
import { jsPDF, type CellConfig } from "jspdf"
import autoTable from 'jspdf-autotable'
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
    orders: ReportData
    revenue: ReportData
}
export default function Charts() {
    const [open, setOpen] = useState<"users" | "orders" | "revenue">()
    const [reportType, setReportType] = useState<ReportDataType>({ orders: "daily", users: "daily", revenue: "daily" })
    const { ordersReport } = OrdersReport(reportType?.orders)
    const { usersReport } = UsersReport(reportType?.users)
    const { revenueReport } = RevenueReport(reportType?.revenue)
    const onTogglePopOver = (data?: any) => setOpen(e => data)
    const onSetReportType = (data: ReportData) => {
        if (open === "orders") setReportType(e => ({ ...e, orders: data }))
        if (open === "users") setReportType(e => ({ ...e, users: data }))
        if (open === "revenue") setReportType(e => ({ ...e, revenue: data }))
        onTogglePopOver()
    }
    const onDownloadOrdersReport = async () => {
        const pdfDoc = new jsPDF();
        pdfDoc.setFontSize(20)
        pdfDoc.text(`Bean Cafe ${changeCase.sentenceCase(reportType.orders)} Order Reports`, 15, 10)
        autoTable(pdfDoc, {
            margin: {
                top: 15
            },
            theme: "grid",
            head: [["Date", "Orders"]],
            body: ordersReport.map(report => ([report.date, report.orders]))
        })
        pdfDoc.autoPrint({ variant: "non-conform" })
        pdfDoc.save("orders.pdf")
    }
    const onDownloadUsersReport = async () => {
        const pdfDoc = new jsPDF();
        pdfDoc.setFontSize(20)
        pdfDoc.text(`Bean Cafe ${changeCase.sentenceCase(reportType.orders)} Users Reports`, 15, 10)
        autoTable(pdfDoc, {
            margin: {
                top: 15
            },
            theme: "grid",
            head: [["Date", "Users"]],
            body: usersReport.map(report => ([report.date, report.users]))
        })
        pdfDoc.autoPrint({ variant: "non-conform" })
        pdfDoc.save("users.pdf")
    }
    const onDownloadRevenueReport = async () => {
        const pdfDoc = new jsPDF();
        pdfDoc.setFontSize(20)
        pdfDoc.text(`Bean Cafe ${changeCase.sentenceCase(reportType.revenue)} Revenue Reports`, 15, 10)
        autoTable(pdfDoc, {
            margin: {
                top: 15
            },
            theme: "grid",
            head: [["Date", "Revenue"]],
            body: revenueReport.map(report => ([report.date, report.revenue]))
        })
        pdfDoc.autoPrint({ variant: "non-conform" })
        pdfDoc.save("revenue.pdf")
    }
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
                                    id='orders-report'
                                    className="!w-auto flex items-center gap-2">
                                    {changeCase.sentenceCase(reportType?.orders ?? "")}
                                    <FaSort />
                                </Button>
                            </div>
                            <div className='w-full h-full min-h-[12rem]'>
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
                            <div className='flex gap-2 px-3 mt-2'>
                                <Button
                                    onClick={onDownloadOrdersReport}
                                    small
                                    tonal
                                    className=' k-color-brand-green '>Download</Button>
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
                                    id='users-report'
                                    className="!w-auto flex items-center gap-2">
                                    {changeCase.sentenceCase(reportType?.users ?? "")}
                                    <FaSort />
                                </Button>
                            </div>
                            <div className='w-full h-full min-h-[12rem]'>
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
                            <div className='flex gap-2 px-3 mt-2'>
                                <Button
                                    onClick={onDownloadUsersReport}
                                    small
                                    raised
                                    tonal
                                    className=' k-color-brand-green '>Download</Button>
                            </div>
                        </div>
                    </Card>
                    <Card
                        margin='m-0'
                        className=' k-color-brand-primary'>
                        <div className='flex flex-col gap-2.5'>
                            <div className='flex justify-between items-baseline'>
                                <div className='text-lg font-medium'>Revenue</div>
                                <Button
                                    onClick={() => onTogglePopOver("revenue")}
                                    small
                                    clear
                                    tonal
                                    id='revenue-report'
                                    className="!w-auto flex items-center gap-2">
                                    {changeCase.sentenceCase(reportType?.revenue ?? "")}
                                    <FaSort />
                                </Button>
                            </div>
                            <div className='w-full h-full min-h-[12rem]'>
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
                                        labels: revenueReport?.map(x => {
                                            let date = x.date
                                            if (reportType?.revenue === "daily") date = moment(x.date).format('MMM DD')
                                            if (reportType?.revenue === "monthly") date = moment(x.date).format('MMM')
                                            if (reportType?.revenue === "yearly") date = moment(x.date).format('YYYY')
                                            return date
                                        }),
                                        datasets: [
                                            {
                                                label: 'Revenue',
                                                data: revenueReport?.map(x => (x.revenue)),
                                                backgroundColor: "#cc9c68"
                                            }
                                        ]
                                    }} />
                            </div>
                            <div className='flex gap-2 px-3 mt-2'>
                                <Button
                                    onClick={onDownloadRevenueReport}
                                    small
                                    raised
                                    tonal
                                    className=' k-color-brand-green '>Download</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <Popover
                onBackdropClick={() => onTogglePopOver(undefined)}
                target={`#${open}-report`}
                opened={!!open}
                className=' k-color-brand-primary  . '>
                <List margin='my-0' nested>
                    {open === "orders" && (
                        REPORT_TYPES.map(type => (
                            <ListItem
                                key={`orders-${type}`}
                                onClick={() => onSetReportType(type as any)}
                                link
                                title={changeCase.sentenceCase(type)}
                                chevron={false}
                                media={<Radio readOnly checked={reportType.orders === type} className=' pointer-events-none' />} />
                        ))
                    )}
                    {open === "users" && (
                        REPORT_TYPES.map(type => (
                            <ListItem
                                key={`users-${type}`}
                                onClick={() => onSetReportType(type as any)}
                                link
                                title={changeCase.sentenceCase(type)}
                                chevron={false}
                                media={<Radio readOnly checked={reportType.users === type} className=' pointer-events-none' />} />
                        ))
                    )}
                    {open === "revenue" && (
                        REPORT_TYPES.map(type => (
                            <ListItem
                                key={`revenue-${type}`}
                                onClick={() => onSetReportType(type as any)}
                                link
                                title={changeCase.sentenceCase(type)}
                                chevron={false}
                                media={<Radio readOnly checked={reportType.revenue === type} className=' pointer-events-none' />} />
                        ))
                    )}
                </List>
            </Popover>
        </>
    )
}
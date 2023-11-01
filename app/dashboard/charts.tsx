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
import { OrdersReport, UsersReport } from '@lib/Admin/reports'
import { FaSort } from 'react-icons/fa';
import { useLocalstorageState } from 'rooks';
import type { ReportData } from '@/types'
import * as changeCase from 'change-case'
import moment from 'moment-timezone';
import { useState } from 'react';
import { REPORT_TYPES } from '@lib/constants'
import { jsPDF, type CellConfig } from "jspdf"
import autoTable from 'jspdf-autotable'
import chartJsImage from 'chartjs-to-image'
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
}
const pdfDoc = new jsPDF();
const chartImage = new chartJsImage()
export default function Charts() {
    const [open, setOpen] = useState<"users" | "orders">()
    const [reportType, setReportType] = useLocalstorageState<ReportDataType>("report-type", { orders: "daily", users: "daily" })
    const { ordersReport } = OrdersReport(reportType?.orders)
    const { usersReport } = UsersReport(reportType?.users)
    const onTogglePopOver = (data?: any) => setOpen(e => data)
    const onSetReportType = (data: ReportData) => {
        if (open === "orders") setReportType(e => ({ ...e, orders: data }))
        if (open === "users") setReportType(e => ({ ...e, users: data }))
        onTogglePopOver()
    }
    const onDownloadOrdersReport = async () => {
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
        // chartImage.setConfig({
        //     type: "bar",
        //     data: {
        //         labels: ordersReport?.map(x => {
        //             let date = x.date
        //             if (reportType?.orders === "daily") date = moment(x.date).format('MMM DD')
        //             if (reportType?.orders === "monthly") date = moment(x.date).format('MMM')
        //             if (reportType?.orders === "yearly") date = moment(x.date).format('YYYY')
        //             return date
        //         }),
        //         datasets: [
        //             {
        //                 label: 'Orders',
        //                 data: ordersReport?.map(x => (x.orders)),
        //                 backgroundColor: "#cc9c68"
        //             }
        //         ]
        //     }
        // })
        // const image = new Image()
        // image.src = await chartImage.toDataUrl()
        // image.crossOrigin = "";
        // image.onload = function () {
        //     pdfDoc.addImage(this as any, "JPEG", 20, 100, pdfDoc.internal.pageSize.width - 40, 100)
        //     pdfDoc.save("test.pdf")
        // }
        pdfDoc.autoPrint({ variant: "non-conform" })
        pdfDoc.save("orders.pdf")
    }
    const onDownloadUsersReport = async () => {
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
        // chartImage.setConfig({
        //     type: "bar",
        //     data: {
        //         labels: ordersReport?.map(x => {
        //             let date = x.date
        //             if (reportType?.orders === "daily") date = moment(x.date).format('MMM DD')
        //             if (reportType?.orders === "monthly") date = moment(x.date).format('MMM')
        //             if (reportType?.orders === "yearly") date = moment(x.date).format('YYYY')
        //             return date
        //         }),
        //         datasets: [
        //             {
        //                 label: 'Orders',
        //                 data: ordersReport?.map(x => (x.orders)),
        //                 backgroundColor: "#cc9c68"
        //             }
        //         ]
        //     }
        // })
        // const image = new Image()
        // image.src = await chartImage.toDataUrl()
        // image.crossOrigin = "";
        // image.onload = function () {
        //     pdfDoc.addImage(this as any, "JPEG", 20, 100, pdfDoc.internal.pageSize.width - 40, 100)
        //     pdfDoc.save("test.pdf")
        // }
        pdfDoc.autoPrint({ variant: "non-conform" })
        pdfDoc.save("users.pdf")
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
                            <div className='grid grid-cols-2 gap-2 px-3 mt-2'>
                                <Button
                                    raised
                                    tonal
                                    radioGroup=''
                                    small>View Full Reports</Button>
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
                            <div className='grid grid-cols-2 gap-2 px-3 mt-2'>
                                <Button
                                    tonal
                                    raised
                                    small>View Full Reports</Button>
                                <Button
                                    onClick={onDownloadUsersReport}
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
                </List>
            </Popover>
        </>
    )
}
import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/models/dbConnect";
import Users from "@/models/users";
import Orders from '@/models/orders'
import { getServerSession } from 'next-auth'
import { AuthOptions } from '@services/NextAuth/AuthOptions'
import type { ReportData, ReportType } from '@/types'
enum ReportDataValue {
    daily = "%Y-%m-%d",
    monthly = "%Y-%m",
    yearly = "%Y"
}
export async function GET(req: NextRequest) {
    const session = await getServerSession(AuthOptions)
    try {
        if (session?.user?.role === "admin" || session?.user?.role === "staff") {
            await dbConnect()
            const reportType: ReportType = req.nextUrl.searchParams.get("type") as any
            const reportData: ReportData = req.nextUrl.searchParams.get("data") as any
            let data: any, date_format = "%Y-%m-%d"
            if (reportData === "daily") date_format = ReportDataValue.daily
            if (reportData === "monthly") date_format = ReportDataValue.monthly
            if (reportData === "yearly") date_format = ReportDataValue.yearly
            if (reportType === "users") {
                data = await Users.aggregate([
                    {
                        $group: {
                            _id: {
                                date: {
                                    $dateToString: {
                                        format: date_format,
                                        date: "$createdAt"
                                    }
                                }
                            },
                            users: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$_id.date",
                            users: 1
                        }
                    },
                    { $sort: { date: 1 } }
                ])
            } else if (reportType === "orders") {
                data = await Orders.aggregate([
                    {
                        $group: {
                            _id: {
                                date: {
                                    $dateToString: {
                                        format: date_format,
                                        date: "$createdAt"
                                    }
                                }
                            },
                            orders: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$_id.date",
                            orders: 1
                        }
                    },
                    { $sort: { date: 1 } }
                ])
            } else if (reportType === "revenue") {
                data = await Orders.aggregate([
                    {
                        $match: {
                            status: "completed"
                        }
                    },
                    {
                        $addFields: {
                            total_payment: { $toDouble: "$total_payment" }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                date: {
                                    $dateToString: {
                                        format: date_format,
                                        date: "$createdAt"
                                    }
                                }
                            },
                            users: { $sum: 1 },
                            total_payment: { $sum: "$total_payment" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$_id.date",
                            revenue: "$total_payment"
                        }
                    },
                    { $sort: { date: 1 } }
                ])
            }
            return NextResponse.json(data)
        } else {
            return NextResponse.json({}, { status: 401 })
        }
    } catch (e) {
        return NextResponse.json({}, { status: 500 })
    }
}
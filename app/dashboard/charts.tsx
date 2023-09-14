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
import { Line, Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { Card } from 'konsta/react';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", "Sept", "Oct", "Nov", "Dec"]
export default function Charts() {
    return (
        <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-2 px-4'>
            <Card
                margin='m-0'
                className=' k-color-brand-primary'>
                <div className='flex flex-col gap-2.5'>
                    <div className='flex justify-between items-baseline'>
                        <div className='text-lg font-medium'>Revenue</div>
                    </div>
                    <div className='w-full h-full'>
                        <Line
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                            }}
                            data={{
                                labels: months,
                                datasets: [
                                    {
                                        label: 'Income',
                                        data: months.map(() => faker.number.int({ min: 0, max: 10000 })),
                                        borderColor: '#cc9c68',
                                        backgroundColor: "#372e1c"
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
                        <div className='text-lg font-medium'>Orders Summary</div>
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
                                labels: months,
                                datasets: [
                                    {
                                        label: 'Income',
                                        data: months.map(() => faker.number.int({ min: 0, max: 10000 })),
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
                        <div className='text-lg font-medium'>New Clients</div>
                    </div>
                    <div className='w-full h-full'>
                        <Line
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                            }}
                            data={{
                                labels: months,
                                datasets: [
                                    {
                                        label: 'Clients',
                                        data: months.map(() => faker.number.int({ min: 0, max: 10000 })),
                                        borderColor: '#cc9c68',
                                        backgroundColor: "#372e1c"
                                    }
                                ]
                            }} />
                    </div>
                </div>
            </Card>
        </div>
    )
}

import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from './DashboardCard';
import dynamic from "next/dynamic";
import { db } from 'src/configs/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import dayjs from 'dayjs';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = () => {
    const [month, setMonth] = useState('1');
    const [chartData, setChartData] = useState({
        categories: [],
        series: []
    });

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    useEffect(()=>{
        const date = new Date();
        const monthNumber = date.getMonth() + 1; // getMonth() returns a zero-based index (0 for January, 1 for February, etc.)
        setMonth(monthNumber);
    },[])

    useEffect(() => {
        const fetchData = async () => {
            const selectedMonth = parseInt(month);
            const startDate1 = dayjs().month(selectedMonth - 1).startOf('month').toDate();
            const endDate1 = dayjs().month(selectedMonth - 1).endOf('month').toDate();
            const startDate2 = dayjs().month(selectedMonth).startOf('month').toDate();
            const endDate2 = dayjs().month(selectedMonth).endOf('month').toDate();

            const requestsCollection = collection(db, 'requests');

            const requestsQuery1 = query(
                requestsCollection,
                where('created_At', '>=', startDate1),
                where('created_At', '<=', endDate1)
            );
            const requestsQuery2 = query(
                requestsCollection,
                where('created_At', '>=', startDate2),
                where('created_At', '<=', endDate2)
            );

            const requestSnapshot1 = await getDocs(requestsQuery1);
            const requestData1 = requestSnapshot1.docs.map(doc => doc.data());
            const requestSnapshot2 = await getDocs(requestsQuery2);
            const requestData2 = requestSnapshot2.docs.map(doc => doc.data());

            const categoriesCollection = collection(db, 'categories');
            const categoriesSnapshot = await getDocs(categoriesCollection);
            const categoriesData = categoriesSnapshot.docs.reduce((acc, doc) => {
                acc[doc.id] = doc.data().nameEN;
                return acc;
            }, {});

            const requestCounts1 = requestData1.reduce((acc, request) => {
                const categoryName = categoriesData[request.department];
                if (categoryName) {
                    acc[categoryName] = (acc[categoryName] || 0) + 1;
                }
                return acc;
            }, {});

            const requestCounts2 = requestData2.reduce((acc, request) => {
                const categoryName = categoriesData[request.department];
                if (categoryName) {
                    acc[categoryName] = (acc[categoryName] || 0) + 1;
                }
                return acc;
            }, {});

            const allCategories = Array.from(new Set([...Object.keys(requestCounts1), ...Object.keys(requestCounts2)]));

            const seriesData1 = allCategories.map(category => requestCounts1[category] || 0);
            const seriesData2 = allCategories.map(category => requestCounts2[category] || 0);

            setChartData({
                categories: allCategories,
                series: [
                    { name: `Requests in ${dayjs().month(selectedMonth - 1).format('MMMM')}`, data: seriesData1 },
                    { name: `Requests in ${dayjs().month(selectedMonth).format('MMMM')}`, data: seriesData2 }
                ]
            });
        };

        fetchData();
    }, [month]);

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: chartData.categories,
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [0, 100]
            }
        }
    };
    

    return (
        <DashboardCard title="Requests Overview" action={
            <Select
                labelId="month-dd"
                id="month-dd"
                value={month}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value={1}>January 2024</MenuItem>
                <MenuItem value={2}>February 2024</MenuItem>
                <MenuItem value={3}>March 2024</MenuItem>
                <MenuItem value={4}>April 2024</MenuItem>
                <MenuItem value={5}>May 2024</MenuItem>
                <MenuItem value={6}>June 2024</MenuItem>
                <MenuItem value={7}>July 2024</MenuItem>
                <MenuItem value={8}>August 2024</MenuItem>
                <MenuItem value={9}>September 2024</MenuItem>
                <MenuItem value={10}>October 2024</MenuItem>
                <MenuItem value={11}>November 2024</MenuItem>
                <MenuItem value={12}>December 2024</MenuItem>
            </Select>
        }>
            <Chart
                options={optionscolumnchart}
                series={chartData.series}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    );
};

export default SalesOverview;

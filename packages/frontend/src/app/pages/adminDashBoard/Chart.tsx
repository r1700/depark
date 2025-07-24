import React, { useState, useEffect, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import { Chart as ChartJS, Title, Tooltip,TooltipItem, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import chartjsPluginDatalabels from 'chartjs-plugin-datalabels';
import './Chart.css';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, chartjsPluginDatalabels);

const Chart = () => {
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [chartData, setChartData] = useState<any>(null);
    const [filterType, setFilterType] = useState<'day' | 'hour'>('day'); // Added filter state
    const chartRef = useRef(null);

    // Function to fetch data from the backend based on the filter (day/hour)
    const fetchData = async (filter: 'day' | 'hour') => {
        try {
            const response = await fetch(`http://localhost:3001/api/data?filter=${filter}`); // Updated URL with query param
            const result = await response.json();
            setChartData(result.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Handle filter change (by day or by hour)
    const handleFilterChange = (filter: 'day' | 'hour') => {
        setFilterType(filter);
        fetchData(filter); // Fetch data with the selected filter
    };

    // Function to switch between chart types
    const handleChartSwitch = (type: 'bar' | 'pie') => {
        setChartType(type);
    };

    // Function to download the chart and design as PDF
    const downloadPDF = () => {
        const input = chartRef.current;

        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF();
                pdf.addImage(imgData, "PNG", 10, 10, 180, 160);  // Adjust size and position
                pdf.save("chart-design.pdf");
            });
        } else {
            console.error("Chart reference is null.");
        }
    };

    // Fetch data when component mounts or filter changes
    useEffect(() => {
        fetchData(filterType); // Fetch data based on the current filter
    }, [filterType]);

    // Bar chart data (divided by all properties)
    const barChartData = {
        labels: chartData?.map((item: any) => `Space ${item.SpaceId}`),
        datasets: [
            {
                label: 'Occupied Hours',
                data: chartData?.map((item: any) => item['Occupied Hours']),
                backgroundColor: '#FF6363',
                borderColor: '#FF6363',
                borderWidth: 1,
            },
            {
                label: 'Entries',
                data: chartData?.map((item: any) => item['Entries']),
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1,
            },
            {
                label: 'Exits',
                data: chartData?.map((item: any) => item['Exits']),
                backgroundColor: '#FFCE56',
                borderColor: '#FFCE56',
                borderWidth: 1,
            },
        ],
    };

    // Create pie chart data with "Occupied Hours" only
    const createPieChartData = () => {
        const colors = chartData?.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);

        return {
            labels: chartData?.map((space: any) => `Space ${space.SpaceId}`),
            datasets: [
                {
                    data: chartData?.map((space: any) => space['Occupied Hours']),
                    backgroundColor: colors, // Different colors for each SpaceId
                    borderColor: colors,
                    borderWidth: 1,
                },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem: TooltipItem<'pie'>) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
                        },
                    },
                    datalabels: {
                        color: '#000',
                        font: {
                            weight: 'bold',
                            size: 14,
                        },
                        align: 'end',
                        anchor: 'end',
                        rotation: 90,
                        offset: 10,
                    },
                },
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        boxWidth: 10,
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                    },
                },
                layout: {
                    padding: 20,
                },
            },
        };
    };

    return (
        <div className="charts-container">
            {/* Filter Bar */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filterType === 'day' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('day')}>
                    By Date
                </button>
                <button
                    className={`filter-btn ${filterType === 'hour' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('hour')}>
                    By Hour
                </button>
            </div>

            {/* Chart Type Switcher */}
            <div className="chart-switcher">
                <button
                    className={`chart-btn ${chartType === 'bar' ? 'active' : ''}`}
                    onClick={() => handleChartSwitch('bar')}>
                    Bar Chart
                </button>
                <button
                    className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
                    onClick={() => handleChartSwitch('pie')}>
                    Pie Chart
                </button>
            </div>

            {/* Chart Display */}
            <div className="chart-container" ref={chartRef}>
                {chartType === 'bar' ? (
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                ) : (
                    <div className="pie-chart">
                        <Pie
                            data={createPieChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
                                        },
                                    },
                                    datalabels: {
                                        color: '#3d3636ff',
                                        font: {
                                            size: 20,
                                        },
                                        formatter: (value: any) => `${value}%`,
                                        align: 'end',
                                        offset: 25,
                                    },
                                },
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Download as PDF button */}
            <div className="download-pdf">
                <button onClick={downloadPDF} className="download-btn">
                    Download as PDF
                </button>
            </div>
        </div>
    );
};

export default Chart;

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [300, 450, 350, 600, 500, 700, 550],
        fill: true,
        backgroundColor: 'rgba(255, 165, 0, 0.3)', 
        borderColor: 'rgb(255, 140, 0)', 
        tension: 0.4,
        pointBackgroundColor: 'rgb(255, 140, 0)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 140, 0)'
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#eee'
        }
      },
      title: {
        display: true,
        text: 'Sales Over the Week',
        color: '#eee'
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            suggestedMax: 800, 
            ticks: {
                color: '#eee' 
            },
            grid: {
                color: '#444' 
            }
        },
        x: {
            ticks: {
                color: '#eee' 
            },
            grid: {
                color: '#444' 
            }
        }
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-lg text-white">
        <h3 className="text-lg font-semibold mb-4 text-white">Sales</h3>
        <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart; 
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

const PurchaseChart = () => {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Purchases',
        data: [650, 720, 800, 950],
        fill: true,
        backgroundColor: 'rgba(0, 170, 0, 0.3)',
        borderColor: 'rgb(0, 150, 0)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(0, 150, 0)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(0, 150, 0)'
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
        text: 'Purchases Over the Month',
        color: '#eee'
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            suggestedMax: 1000,
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
         <h3 className="text-lg font-semibold mb-4 text-white">Purchase</h3>
        <Line data={data} options={options} />
    </div>
  );
};

export default PurchaseChart; 
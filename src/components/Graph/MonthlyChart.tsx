import { useContext } from 'react';
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Ctx } from '../ContextProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Montly Flux Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];



export default function MonthlyChart() {
  const ctx = useContext(Ctx);
  const monthlyData = ctx.layer;

  const avgShine: number[] = [];
  if (monthlyData)
    monthlyData[4].rasters.map((element) => {
      let counter: number = 0;
      for (let j = 0; j < element.length; j++) {
        counter += element[j];
      }
      avgShine.push(counter / element.length);
    });

  const data = {
    labels,
    datasets: [
      {
        label: 'Average kWh/kW/year',
        data: avgShine,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}

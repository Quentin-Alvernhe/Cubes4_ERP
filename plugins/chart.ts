import {
  Chart,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Colors,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
} from "chart.js";
export default defineNuxtPlugin(() => {
  Chart.register(
    ArcElement,
    Colors,
    PointElement,
    Legend,
    Title,
    Tooltip,
    CategoryScale,
    LinearScale,
    LineElement,
  );
});

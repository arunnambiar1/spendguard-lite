<template><canvas ref="canvas" height="140"></canvas></template>
<script setup>
import { onMounted, watch, ref } from "vue";
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);
const props = defineProps({ items: { type: Array, default: () => [] } });
const canvas = ref(null); let chart;
function build(){
  const data = (props.items||[]).map(t => ({ x: new Date(t.posted_at), y: Number(t.amount) })).reverse();
  if (chart) chart.destroy();
  chart = new Chart(canvas.value.getContext("2d"), {
    type: "line",
    data: { datasets: [{ label: "Spending", data }] },
    options: { parsing: false, scales: { x: { type: "time" }, y: { beginAtZero: true } } }
  });
}
onMounted(build);
watch(() => props.items, build, { deep: true });
</script>

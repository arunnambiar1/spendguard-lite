<template>
  <div v-if="loading || error" class="card" style="margin-top:2rem">
    <p v-if="loading">Loading chart…</p>
    <p v-else class="text-red-500">{{ error }}</p>
  </div>
  <canvas v-else ref="canvas" class="card" style="margin-top:2rem"></canvas>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import 'chartjs-adapter-date-fns'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  Filler,  
  Title,  
  Tooltip,
  Legend
} from 'chart.js'

// register plugins & controllers once
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data:    { type: Array,   default: () => [] },
  loading: { type: Boolean, default: false },
  error:   { type: String,  default: null }
})

let chart = null
const canvas = ref(null)

function makeDataset(arr) {
  const last20 = arr.slice(-20)
  return {
    labels: last20.map(t => new Date(t.posted_at)),
    datasets: [{
      label: 'Spend ($)',
      data: last20.map(t => Number(t.amount)), // coerce here too
      tension: 0.35,
      fill: true,
      borderColor: '#60a5fa',
      backgroundColor: 'rgba(96,165,250,0.15)',
      borderWidth: 2
    }]
  }
}

onMounted(() => {
  chart = new Chart(canvas.value, {
    type: 'line',
    data: makeDataset(props.data),
    options: {
      responsive: true,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => `$${ctx.parsed.y.toFixed(2)}` }
        }
      },
      scales: {
        x: {
          type: 'time',
          axis: 'x',                   // ← **required** now
          title: { display: true, text: 'Date' },
          time: {
            tooltipFormat: 'MMM d, yyyy HH:mm',
            displayFormats: { month: 'MMM yyyy', hour: 'HH:mm' }
          },
          ticks: { autoSkip: true, maxRotation: 0 }
        },
        y: {
          axis: 'y',                   // ← **required** now
          beginAtZero: true,
          title: { display: true, text: 'Amount ($)' }
        }
      }
    }
  })
})


watch(
  () => props.data,
  (newData) => {
    if (!chart) {
      initChart()
    } else {
      try {
        chart.data = makeDataset(newData)
        chart.update()
      } catch (err) {
        console.error('Chart update error:', err)
      }
    }
  }
)
</script>

<style scoped>
.card {
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  margin-top: 2rem;
}
canvas {
  height: 300px !important;
  width: 100%  !important;
}
</style>

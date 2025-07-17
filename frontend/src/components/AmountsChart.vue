<template>
    <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
    data: { type: Array, default: () => []}
})

const canvas = ref(null)
let chart = null

function makeDataset(arr) {
    const last = arr.slice(-20)

    return{
        labels: last.map(t => new Date(t.posted_at).toLocaleTimeString()),
        datasets: [{
            label: 'Spend ($)',
            data: last.map(t => t.amount),
            tension: 0.35,
            borderColor: '#60a5fa',                       // emerald‑400 line
            backgroundColor: 'rgba(96,165,250,0.15)',     // light fill
            borderWidth: 2,
            fill: true
        }]
        
    }
}


onMounted(() => {
    chart = new Chart(canvas.value, {
        type: 'line',
        data: makeDataset(props.data),
        options: {
            animation: false,
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
            type: 'time',                              // uses the adapter
            time: { displayFormats: { minute: 'HH:mm' } },
            ticks: { maxRotation: 0, autoSkip: true }
    },
    y: { beginAtZero: true }
  }
 }
    })
})

watch(() => props.data, (val) => {
    if (!chart) return
    chart.data = makeDataset(val)
    chart.update()
})

</script>
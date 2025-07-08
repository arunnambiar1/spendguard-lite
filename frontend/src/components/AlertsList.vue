<template>
  <div class="list alerts-list">
    <h2>Alerts</h2>
    <ul>
      <li v-for="a in alerts" :key="a.id">
        <span class="time">{{ a.created_at }}</span> —
        <span class="category">{{ a.category }}</span>
        spike! Score:
        <span class="score">{{ a.score.toFixed(2) }}</span>
      </li>
    </ul>
    <button @click="fetchAlerts">Refresh</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const alerts = ref([])

async function fetchAlerts() {
  try {
    const res = await axios.get(`${API}/alerts`)
    alerts.value = res.data
  } catch (e) {
    console.error('Failed to load alerts:', e)
  }
}

// Load on mount
onMounted(fetchAlerts)
</script>

<style scoped>
.alerts-list {
  border: 1px solid #f99;
  padding: 1rem;
  border-radius: 4px;
}
.alerts-list li {
  margin: 0.5rem 0;
  color: #c00;
}
.alerts-list button {
  margin-top: 1rem;
  padding: 0.5rem;
}
</style>

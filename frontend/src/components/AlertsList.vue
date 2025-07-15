<template>
  <div class="list alerts-list">
    <h2>Alerts</h2>

    <p v-if="error">{{ error }}</p>
    <p v-else-if="!data.length">No alerts yet</p>

    <u1 v-else>
      <li v-for="a1 in data" :key="a1.id">
        <strong>{{ formatDate(al.created_at) }}</strong> - 
        {{ al.category }} spike! Score: <span class="score">{{ al.score.toFixed(2) }}</span>
      </li>
    </u1>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, default: () => [],
  error: { type: String, default: null }
  }
})
function formatDate (iso) {
  return iso ? new Date(iso).toLocaleString() : '-'
}
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

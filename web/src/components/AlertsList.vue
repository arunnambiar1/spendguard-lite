<template>
  <div>
    <h3>Alerts</h3>
    <p v-if="loading">Loading…</p>
    <ul v-else>
      <li v-for="a in items" :key="a.id">
        <strong>{{ a.category }}</strong> — score {{ Number(a.score).toFixed(2) }} at {{ new Date(a.created_at).toLocaleString() }}
      </li>
    </ul>
  </div>
</template>
<script setup>
defineProps({ items: Array, loading: Boolean });
</script>

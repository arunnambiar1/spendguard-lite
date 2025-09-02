<template>
  <div>
    <h3>Transactions</h3>
    <p v-if="loading">Loading…</p>
    <p v-if="error" style="color:#f55">{{ error }}</p>
    <button @click="$emit('refresh')">Refresh</button>
    <table v-if="items.length" style="margin-top:8px">
      <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Score</th></tr></thead>
      <tbody>
        <tr v-for="t in items" :key="t.id">
          <td>{{ new Date(t.posted_at).toLocaleString() }}</td>
          <td>{{ t.category }}</td>
          <td>${{ Number(t.amount).toFixed(2) }}</td>
          <td>{{ (t.score ?? 0).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No data</p>
  </div>
</template>
<script setup>
defineProps({ items: Array, loading: Boolean, error: String });
</script>

<template>
  <div class="list transactions-list">
    <h2>Transactions</h2>

    <!--Loading? -->
    <div v-if="loading" class="loading">Loading transactions…</div>

    <!--Error? -->
    <div v-else-if="error" class="error">{{ error }}</div>

    <!--Nothing to show? -->
    <div v-else-if="!data.length" class="empty">No transactions yet.</div>

    <!--Real data -->
    <ul v-else>
      <li v-for="tx in data" :key="tx.id">
        <strong>{{ new Date(tx.posted_at).toLocaleString() }}</strong>
        &nbsp;—&nbsp;
        <span>${{ Number(tx.amount).toFixed(2) }}</span>
      </li>
    </ul>

    <!--Let parent re-fetch -->
    <button @click="$emit('refresh')">Refresh</button>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, default: () => []},
  loading: { type: Boolean, default: false},
  error: { type: String, default: null}
})

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleString() : '_'
}
</script>

<style scoped>
.transactions-list {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
}

.transactions-list ul {      
  list-style: none;
  margin: 0;
  padding: 0;
}

.transactions-list li {
  margin: 0.5rem 0;
}

.transactions-list button {
  margin-top: 1rem;
  padding: 0.5rem;
}
</style>
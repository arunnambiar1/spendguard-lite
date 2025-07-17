<template>
  <div class="list transactions-list">
    <h2>Transactions</h2>
    
    <p v-if="error">{{ error }}</p>
    <p v-else-if="!data.length">No transactions yet.</p>

    <u1 v-else>
      <li v-for="tx in data" :key="tx.id">
        <strong>{{ formatDate(tx.posted_at) }}</strong> -
        {{ tx.category }}:
        ${{ Number(tx.amount).toFixed(2) }}
      </li>
    </u1>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, default: () => []},
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
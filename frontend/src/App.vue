<template>
  <TransactionForm @saved="handleSaved" />

  <AmountsChart :data="transactions" class="card" style="margin-top:2rem" />

  <div class="grid" style="margin-top:2rem">
    <TransactionsList :data="transactions" :error="txError" />
    <AlertsList :data="alerts" :error="alError" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios              from 'axios'

import TransactionForm  from './components/TransactionForm.vue'
import TransactionsList from './components/TransactionsList.vue'
import AlertsList       from './components/AlertsList.vue'
import AmountsChart     from './components/AmountsChart.vue'

const API          = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const transactions = ref([])
const alerts       = ref([])

const txError = ref(null)
const alError = ref(null)

async function fetchTransactions () {
  try {
    const res = await axios.get(`${API}/transactions`)
    transactions.value = res.data
    txError.value = null
  } catch {
    txError.value = 'Could not load data'
  }
}
async function fetchAlerts () {
  try {
    const res = await axios.get(`${API}/alerts`)
    alerts.value = res.data
    alError.value = null
  } catch {
    alError.value = 'Could not load data'
  }
}

onMounted(() => {
  fetchTransactions()
  fetchAlerts()
})

function handleSaved () {
  fetchTransactions()
  fetchAlerts()
}

setInterval(() => {
  fetchTransactions()
  fetchAlerts()
}, 10_000)
</script>

<style>
/* Center everything and give some breathing room */
#app {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

/* Lay out the two lists in a row on wide screens, stack on small screens */
.lists {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}

/* Make each list take half the width (or full on narrow screens) */
.lists > * {
  flex: 1 1 300px;
}
</style>

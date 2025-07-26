<template>
  <!-- when the form emits @saved, we call handleSaved -->
  <TransactionForm @saved="handleSaved" />

  <!-- your chart will redraw whenever `transactions` changes -->
  <AmountsChart :data="transactions" class="card" />

  <div class="lists" style="margin-top:2rem">
    <!-- pass data, loading + error into each list -->
    <TransactionsList
      :data="transactions"
      :loading="txLoading"
      :error="txError"
      @refresh="fetchTransactions"
    />
    <AlertsList
      :data="alerts"
      :loading="alLoading"
      :error="alError"
      @refresh="fetchAlerts"
    />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import TransactionForm  from './components/TransactionForm.vue'
import AmountsChart      from './components/AmountsChart.vue'
import TransactionsList  from './components/TransactionList.vue'
import AlertsList        from './components/AlertsList.vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// reactive state
const transactions = ref([])
const alerts       = ref([])

const txLoading = ref(false)
const txError   = ref(null)
const alLoading = ref(false)
const alError   = ref(null)

// fetchers
async function fetchTransactions() {
  txLoading.value = true
  txError.value   = null
  try {
    const res = await axios.get(`${API}/transactions`)
    transactions.value = res.data
  } catch (err) {
    txError.value = 'Could not load transactions'
  } finally {
    txLoading.value = false
  }
}

async function fetchAlerts() {
  alLoading.value = true
  alError.value   = null
  try {
    const res = await axios.get(`${API}/alerts`)
    alerts.value = res.data
  } catch (err) {
    alError.value = 'Could not load alerts'
  } finally {
    alLoading.value = false
  }
}

// pull everything on startup
onMounted(() => {
  fetchTransactions()
  fetchAlerts()
})

// whenever the form emits “saved”, re‐run both fetches
function handleSaved() {
  fetchTransactions()
  fetchAlerts()
}
</script>


<style scoped>


.lists {
  display: flex;
  gap: 2rem;
}
.lists > * {
  flex: 1 1 300px;
}
.card {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>

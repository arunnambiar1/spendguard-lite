 <template>
 <TransactionForm @saved="handleSaved" />

  <AmountsChart
    :data="transactions"
    class="card"
    style="margin-top: 2rem"
  />

  <div class="lists" style="margin-top: 2rem">
    <TransactionsList
      :data="transactions"
      :error="txError"
    />
    <AlertsList
      :data="alerts"
      :error="alError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import TransactionForm  from './components/TransactionForm.vue'
import AmountsChart      from './components/AmountsChart.vue'
import TransactionsList  from './components/TransactionsList.vue'
import AlertsList        from './components/AlertsList.vue'

const API        = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const transactions = ref([])
const alerts       = ref([])

const txError = ref(null)
const alError = ref(null)

async function fetchTransactions () {
  txError.value = null
  try {
    const res = await axios.get(`${API}/transactions`)
    transactions.value = res.data
  } catch {
    txError.value = 'Could not load data'
  }
}

async function fetchAlerts () {
  alError.value = null
  try {
    const res = await axios.get(`${API}/alerts`)
    alerts.value = res.data
  } catch {
    alError.value = 'Could not load data'
  }
}

onMounted(() => {
  fetchTransactions()
  fetchAlerts()
})

// Whenever the form emits “saved”, we re‑fetch both lists
function handleSaved () {
  fetchTransactions()
  fetchAlerts()
}

// Poll every 10 seconds to keep UI fresh
setInterval(() => {
  fetchTransactions()
  fetchAlerts()
}, 10_000)
</script>

<style scoped>
#app {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.lists {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.lists > * {
  flex: 1 1 300px;
}
</style>
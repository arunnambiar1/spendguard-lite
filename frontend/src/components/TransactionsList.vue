
<template>
    <div class="list transactions-list">
        <h2>Transactions</h2>

        <!-- 1. Render a list item for each transactions -->
         <ul>
            <li v-for="tx in transactions" :key="tx.id">
                <!-- 2. Show the timestamp, cateogry, and amount-->
                 <strong>{{ tx.posted_at }}</strong> - 
                 {{ tx.category }}: ${{ tx.amount !== undefined ? Number(tx.amount).toFixed(2) : '-' }}
            </li>
         </ul>

         <!-- 3. A button to manually re-fetch data -->
         <button @click="fetchTransactions">Refresh</button>
    </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
console.log('🌐 Using API base URL:', API)
const transactions = ref([])


function formatDate(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString()
}

async function fetchTransactions(){
    try{
        const res = await axios.get(`${API}/transactions`)
        console.log("🔥 fetched transactions:", res.data)
        transactions.value = res.data
    } catch (e) {
        console.error('Failed to load transactions:', e)

    }
}

onMounted(fetchTransactions)
</script>

<style scoped>
.transactions-list{
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
}
.transactions-list u1 {
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
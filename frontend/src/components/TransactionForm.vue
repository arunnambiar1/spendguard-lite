<template>
  <form @submit.prevent="onSubmit" class="card">
    <!-- REMOVE THIS BLOCK:
    <div>
      <label>User ID:</label>
      <input v-model="userId" placeholder="Enter your user ID" required />
    </div>
    -->
    <div>
      <label>Category:</label>
      <input v-model="category" placeholder="e.g. Dining" required />
    </div>
    <div>
      <label>Amount:</label>
      <input type="number" v-model.number="amount" step="0.01" required />
    </div>
    <div>
      <label>Posted At:</label>
      <input type="datetime-local" v-model="postedAt" required />
    </div>
    <button type="submit">Submit Transaction</button>
    <p v-if="score !== null">Anomaly Score: {{ score }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios     from 'axios'

// REMOVE: const userId   = ref('')
const category = ref('')
const amount   = ref(0)
const postedAt = ref('')

const score   = ref(null)
const loading = ref(false)

const emit = defineEmits(['saved'])
const API  = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function onSubmit() {
  loading.value = true
  const payload = {
    // REMOVE: user_id:   userId.value,
    category:  category.value,
    amount:    amount.value,
    posted_at: postedAt.value
  }

  try {
    const r = await axios.post(`${API}/transactions`, payload)
    score.value = r.data.score
    emit('saved')        
    // reset the form
    // REMOVE: userId.value = 
    category.value = postedAt.value = ''
    amount.value = 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style>
.card { padding:1rem; margin-bottom:2rem; background:#fff; border-radius:0.5rem; }
.card div { margin-bottom:0.5rem; }
</style>

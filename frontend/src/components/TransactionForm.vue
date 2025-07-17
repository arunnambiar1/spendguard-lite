
<template>

  <form @submit.prevent="onSubmit">

    
    <label for="user‑id">User ID:</label>
    <input
      id="user‑id"
      type="text"
      v-model="userId"
      placeholder="Enter your user ID"
      required
    />

    
    <label for="category">Category:</label>
    <input
      id="category"
      type="text"
      v-model="category"
      placeholder="Spending Category (e.g. Dining, Grocery)"
      required
    />

    
    <label for="amount">Amount:</label>
    <input
      id="amount"
      type="number"
      v-model.number="amount"
      placeholder="0.00"
      step="0.01"
      required
    />

    
    <label for="posted‑at">Posted At:</label>
    <input
      id="posted‑at"
      type="datetime-local"
      v-model="postedAt"
      required
    />

    
    <button type="submit">Submit Transaction</button>

    
    <p v-if="score !== null">
      Anomaly Score: {{ score }}
    </p>
  </form>
</template>

<script setup>
  import {ref, defineEmits} from 'vue'
  import axios from 'axios'

  const userId   = ref('')
  const category = ref('')
  const amount   = ref(null)
  const postedAt = ref('')
  const score    = ref(null)
  const loading  = ref(false)
  const errorMsg = ref('')

  const emit = defineEmits(['saved'])
  const API  = import.meta.env.VITE_API_URL

  async function onSubmit(){
    console.log('🔥 onSubmit fired!', { userId: userId.value })
    const payload = {
      user_id: userId.value,
      category: category.value,
      amount: amount.value,
      posted_at: postedAt.value
    }

    try {

    const res = await axios.post(`${API}/transactions`, payload)
    score.value = res.data.score
    emit('saved')
    userId.value = category.value = amount.value = postedAt.value = ''
  } catch (err) {
    console.error('Submit failed:', err)
    } finally {
      loading.value = false
    }
  }


</script>
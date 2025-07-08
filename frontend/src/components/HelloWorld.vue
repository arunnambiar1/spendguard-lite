
<template>

  <form @submit.prevent="onSubmit">

    <label for="user-id">USER ID:</label>
    <input
      id="user-id"
      type="text"
      v-model="userId"
      placeholder="Enter you user ID"
      required
    />

    <label for="category">Cateogry:</label>
    <input
      id="category"
      type="text"
      v-model="category"
      placeholder="Enter spending category (e.g. Dining, Grocery)"
      required
    />

    <label for="Amount">Amount:</label>
    <input
      id="amount"
      type="number"
      v-model="amount"
      placeholder="0.00"
      step="0.01"
      required
    />

    
    <label for="posted-at">Posted At:</label>
    <input
      id="posted-at"
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
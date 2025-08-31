<template>
  <form class="card" @submit.prevent="submit">
    <h3>New Transaction</h3>
    <input v-model="category" placeholder="e.g. Dining" />
    <input v-model.number="amount" type="number" step="0.01" />
    <input v-model="postedAt" type="datetime-local" />
    <button :disabled="submitting">{{ submitting ? "Saving…" : "Submit Transaction" }}</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import api from "../api";

const emit = defineEmits(["created"]);
const category = ref("Food");
const amount = ref(0);
const postedAt = ref(new Date().toISOString().slice(0,16));
const submitting = ref(false);

async function submit() {
  submitting.value = true;
  try {
    const payload = {
      category: category.value,
      amount: Number(amount.value),
      posted_at: new Date(postedAt.value).toISOString(),
    };
    const { data } = await api.post("/transactions", payload);
    emit("created", data);
    amount.value = 0;
  } finally {
    submitting.value = false;
  }
}
</script>

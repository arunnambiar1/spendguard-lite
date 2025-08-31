<template>
  <main class="container">
    <AuthBar @authed="fetchAll" />

    <section class="grid">
      <div>
        <TransactionForm @created="onCreated" />
        <div class="card">
          <h3>Transactions</h3>
          <p v-if="loading">Loading…</p>
          <p v-if="error" class="error">{{ error }}</p>
          <button @click="fetchAll" style="margin-bottom:8px">Refresh</button>
          <table v-if="txs.length">
            <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Score</th></tr></thead>
            <tbody>
              <tr v-for="t in txs" :key="t.id">
                <td>{{ new Date(t.posted_at).toLocaleString() }}</td>
                <td>{{ t.category }}</td>
                <td>${{ Number(t.amount).toFixed(2) }}</td>
                <td>{{ (t.score ?? 0).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else-if="!loading && !error">No transactions yet.</p>
        </div>
      </div>

      <div>
        <div class="card"><h3>Alerts</h3>
          <p v-if="loading">Loading…</p>
          <ul v-else>
            <li v-for="a in alerts" :key="a.id">
              <strong>{{ a.category }}</strong> — score {{ a.score.toFixed(2) }} at {{ new Date(a.created_at).toLocaleString() }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import api from "./api";
import AuthBar from "./components/AuthBar.vue";
import TransactionForm from "./components/TransactionForm.vue";

const txs = ref([]);
const alerts = ref([]);
const loading = ref(false);
const error = ref("");

async function fetchAll() {
  loading.value = true; error.value = "";
  try {
    const [t, a] = await Promise.all([api.get("/transactions"), api.get("/alerts")]);
    txs.value = t.data; alerts.value = a.data;
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || "Failed to load";
  } finally {
    loading.value = false;
  }
}

function onCreated(t) {
  txs.value = [t, ...txs.value];
}

fetchAll(); // initial load after mount
</script>

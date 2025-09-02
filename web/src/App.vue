<template>
  <main style="padding:16px; max-width:1000px; margin:auto; color:#eee; background:#1e1e1e; min-height:100vh">
    <h2>SpendGuard</h2>
    <AuthBar @authed="fetchAll" />
    <h3>New Transaction</h3>
    <TransactionForm @created="onCreated" />
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:16px">
      <div style="background:#2a2a2a;padding:12px;border-radius:12px"><SpendChart :items="txs"/></div>
      <div style="background:#2a2a2a;padding:12px;border-radius:12px"><AlertsList :items="alerts" :loading="loading"/></div>
    </div>
    <div style="background:#2a2a2a;padding:12px;border-radius:12px;margin-top:16px">
      <TransactionsList :items="txs" :loading="loading" :error="error" @refresh="fetchAll" />
    </div>
  </main>
</template>
<script setup>
import { ref } from "vue";
import api from "./api";
import AuthBar from "./components/AuthBar.vue";
import TransactionForm from "./components/TransactionForm.vue";
import SpendChart from "./components/SpendChart.vue";
import TransactionsList from "./components/TransactionsList.vue";
import AlertsList from "./components/AlertsList.vue";
const txs = ref([]); const alerts = ref([]); const loading = ref(false); const error = ref("");
async function fetchAll(){ loading.value=true; error.value="";
  try{ const [t,a] = await Promise.all([api.get("/transactions"), api.get("/alerts")]); txs.value = t.data; alerts.value = a.data; }
  catch(e){ error.value = e?.response?.data?.detail ?? e?.message ?? "Network Error"; }
  finally{ loading.value=false; } }
function onCreated(t){ txs.value = [t, ...txs.value]; }
fetchAll();
</script>

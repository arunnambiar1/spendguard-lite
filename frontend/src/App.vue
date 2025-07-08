<template>
  <div id="app">
    <!-- our custom components -->
    <TransactionForm />

    <div class="lists">
      <TransactionsList />
      <AlertsList />
    </div>
  </div>
</template>


<script setup>
// 1. Import your three components
import TransactionForm  from './components/TransactionForm.vue'
import TransactionsList from './components/TransactionsList.vue'
import AlertsList       from './components/AlertsList.vue'
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

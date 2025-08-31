<!-- src/components/AlertsList.vue -->
<script setup>

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  // if you have a refresh button handler:
  refresh: {
    type: Function,
    required: false
  }
})
</script>

<template>
  <div class="card" style="margin-top:2rem">
    <h2>Alerts</h2>

    <!-- 1. loading state -->
    <p v-if="props.loading">Loading alerts…</p>

    <!-- 2. error state -->
    <p v-else-if="props.error" class="text-red-500">
      {{ props.error }}
    </p>

    <!-- 3. no-data -->
    <p v-else-if="props.data.length === 0">
      No alerts yet.
    </p>

    <!-- 4. actual list -->
    <ul v-else>
      <li v-for="alert in props.data" :key="alert.id">
        {{ alert.category }} – ${{ Number(alert.amount).toFixed(2) }}
      </li>
    </ul>

    <!-- 5. manual refresh -->
    <button v-if="props.refresh" @click="props.refresh">
      Refresh
    </button>
  </div>
</template>

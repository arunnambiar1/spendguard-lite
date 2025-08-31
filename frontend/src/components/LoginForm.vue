<template>
    <form class="card" @submit.prevent="onSubmit">
        <h2>Log in</h2>
        <p v-if="error" class="error">{{ error }}</p>
        <label>Username
            <input v-model="username" required />
        </label>
        <label>Password
            <input type="password" v-model="password" required />
        </label>
        <button type="submit" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Log in' }}
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { login, setAuthToken } from '../services/AuthService'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const emit = defineEmits(['authenticated'])

async function onSubmit() {
    loading.value = true
    error.value = null
    try {
        const { token, user } = await login ({
            username: username.value,
            password: password.value
        })
        setAuthToken(token)
        emit('authenticated', user)
    } catch (err) {
        error.value = err.response?.data?.message || 'Login failed'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.card { padding: 1rem; max-width: 320px; margin: auto; }
.error { color: #e53e3e; }
button { margin-top: 1rem;}
</style>
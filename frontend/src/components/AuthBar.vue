<template>
  <div class="card" style="display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:12px">
    <div v-if="token">Signed in • <code style="opacity:.7">{{ email }}</code></div>
    <div v-else style="display:flex;gap:8px;align-items:center;width:100%">
      <input v-model="email" placeholder="email" style="flex:1" />
      <input v-model="password" type="password" placeholder="password" style="flex:1" />
      <button @click="register">Register</button>
      <button @click="login">Login</button>
    </div>
    <button v-if="token" @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../api";

const emit = defineEmits(["authed"]);
const token = ref(localStorage.getItem("token"));
const email = ref(localStorage.getItem("email") || "me@test.com");
const password = ref("pass123");

async function register() {
  const { data } = await api.post("/auth/register", { email: email.value, password: password.value });
  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.user.email);
  token.value = data.token;
  emit("authed");
}
async function login() {
  const { data } = await api.post("/auth/login", { email: email.value, password: password.value });
  localStorage.setItem("token", data.token);
  localStorage.setItem("email", email.value);
  token.value = data.token;
  emit("authed");
}
function logout() {
  localStorage.removeItem("token");
  token.value = null;
  emit("authed");
}
</script>

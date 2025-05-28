<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')
const messages = ref([])

onMounted(() => {
  socket.on('incoming-command', (data) => {
    messages.value.unshift(data)
  })
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">📨 Live Incomming Command (Live)</h2>
    <ul>
      <li v-for="(msg, i) in messages" :key="i" class="mb-2 border-b pb-2">
        <strong>{{ msg.name }}</strong>: {{ msg.text }} <br />
        <small>ID: {{ msg.phoneNumber }}</small>
      </li>
    </ul>
  </div>
</template>
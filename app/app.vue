<script setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster position="top-right" />  
  </NuxtLayout>
</template>

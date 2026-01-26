<template>
  <div class="bg-black min-h-screen">
    <NuxtPage />
    <Analytics />
  </div>
</template>


<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
</script>
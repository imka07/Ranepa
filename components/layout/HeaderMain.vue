<template>
  <header class="bg-slate-800/80 backdrop-blur border-b border-white/10 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/30 transition">
          <span class="text-white font-bold text-lg">R</span>
        </div>
        <span class="text-white font-bold text-xl hidden sm:inline">Reshala</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          to="/"
          class="text-gray-300 hover:text-white transition text-sm font-medium"
        >
          Главная
        </NuxtLink>
        <NuxtLink
          to="/#about"
          class="text-gray-300 hover:text-white transition text-sm font-medium"
        >
          О нас
        </NuxtLink>
        <NuxtLink
          to="/#reviews"
          class="text-gray-300 hover:text-white transition text-sm font-medium"
        >
          Отзывы
        </NuxtLink>
      </nav>

      <!-- Auth Buttons -->
      <div class="flex items-center gap-3">
        <NuxtLink
          v-if="!isAuthenticated"
          to="/auth"
          class="px-4 py-2 text-white text-sm font-medium rounded-md border border-white/20 hover:border-white/40 hover:bg-white/5 transition"
        >
          Вход
        </NuxtLink>
        <NuxtLink
          v-if="!isAuthenticated"
          to="/auth"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 transition"
        >
          Регистрация
        </NuxtLink>
        <NuxtLink
          v-if="isAuthenticated"
          to="/dashboard"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 transition flex items-center gap-2"
        >
          <img
            src="/public/icons/profile.svg"
            alt="Profile"
            width="24"
            height="24"
          />
          <span class="hidden sm:inline">{{ user?.name || 'Кабинет' }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { user, isAuthenticated } = useAuth()
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>

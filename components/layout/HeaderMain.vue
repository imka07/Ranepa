<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/30 transition">
          <span class="text-white font-bold text-lg">R</span>
        </div>
        <span class="text-slate-900 font-bold text-xl hidden sm:inline">Reshala</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          to="/"
          class="nav-link text-slate-700 hover:text-slate-900 transition text-sm font-medium px-4 py-2 rounded-full"
        >
          Главная
        </NuxtLink>
        <NuxtLink
          to="/#about"
          class="nav-link text-slate-700 hover:text-slate-900 transition text-sm font-medium px-4 py-2 rounded-full"
        >
          О нас
        </NuxtLink>
        <NuxtLink
          to="/#reviews"
          class="nav-link text-slate-700 hover:text-slate-900 transition text-sm font-medium px-4 py-2 rounded-full"
        >
          Отзывы
        </NuxtLink>
      </nav>

      <!-- Dashboard Button -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/dashboard"
          class="animated-btn px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-md shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <img
            src="/public/icons/profile.svg"
            alt="Profile"
            width="24"
            height="24"
          />
          <span class="hidden sm:inline">Личный кабинет</span>
          <span class="inline sm:hidden">ЛК</span>
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

/* Синяя овальная обводка при наведении на навигационные ссылки */
.nav-link {
  position: relative;
  transition: all 0.3s ease;
}

.nav-link:hover {
  border: 2px solid #0046FF;
  background-color: rgba(0, 70, 255, 0.05);
}

/* Skew-анимация для кнопки "Личный кабинет" */
.animated-btn {
  position: relative;
  z-index: 1;
  overflow: hidden;
  cursor: pointer;
}

.animated-btn:hover {
  color: white;
}

.animated-btn::after {
  content: "";
  background: #0046FF;
  position: absolute;
  z-index: -1;
  left: -20%;
  right: -20%;
  top: 0;
  bottom: 0;
  transform: skewX(-45deg) scale(0, 1);
  transition: all 0.5s;
}

.animated-btn:hover::after {
  transform: skewX(-45deg) scale(1, 1);
  transition: all 0.5s;
}
</style>
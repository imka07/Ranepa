<template>
    <div
      v-if="show"
      class="flex items-center justify-center"
      :class="overlay ? 'fixed inset-0 bg-black bg-opacity-40 z-50' : ''"
    >
      <div
        class="animate-spin rounded-full border-t-2 border-b-2"
        :class="[
          sizeClass,
          colorClass
        ]"
      ></div>
      <p v-if="text" class="ml-3 text-white text-lg font-medium">
        {{ text }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    show?: boolean;      // показывать или нет
    overlay?: boolean;   // затемнённый фон (глобальный loader)
    size?: "sm" | "md" | "lg";
    color?: "blue" | "white" | "gray";
    text?: string;       // кастомный текст
  }
  
  const props = withDefaults(defineProps<Props>(), {
    show: true,
    overlay: false,
    size: "md",
    color: "blue",
    text: "",
  });
  
  const sizeClass = computed(() => {
    switch (props.size) {
      case "sm": return "w-6 h-6 border-2";
      case "lg": return "w-16 h-16 border-4";
      default:   return "w-10 h-10 border-2";
    }
  });
  
  const colorClass = computed(() => {
    switch (props.color) {
      case "white": return "border-white";
      case "gray": return "border-gray-400";
      default:     return "border-blue-500";
    }
  });
  </script>
  
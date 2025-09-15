<template>
  <form class="w-full min-h-[30vh] flex items-center justify-center p-4">
    <label
      for="file"
      :class="[
        'group relative flex flex-col items-center justify-center text-center',
        'w-full max-w-xl cursor-pointer rounded-3xl border-2 border-dashed',
        'bg-gray-100/80 hover:bg-gray-100 transition-colors duration-200',
        'px-12 py-10 shadow-xl',
        isDragging ? 'border-gray-900 bg-gray-100' : 'border-gray-400/70'
      ]"
      aria-label="Загрузите файл перетаскиванием или выберите его"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div class="flex flex-col items-center justify-center gap-1">
        <svg class="h-12 w-12 text-gray-600 mb-4" viewBox="0 0 640 512" aria-hidden="true">
          <path
            fill="currentColor"
            d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
          />
        </svg>
        <p class="text-gray-800 font-medium">Перетащите файл сюда</p>
        <p class="text-gray-500">или</p>
        <span
          class="mt-1 inline-flex items-center rounded-xl bg-gray-800 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 group-hover:bg-black"
        >
          Выбрать файл
        </span>
      </div>
      <input
        id="file"
        type="file"
        class="sr-only"
        @change="onChange"
      />
    </label>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'select', file: File): void }>()

const isDragging = ref(false)

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.item(0) ?? null
  if (file) emit('select', file)
}

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input?.files?.item(0) ?? null
  if (file) emit('select', file)
}
</script>

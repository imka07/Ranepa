<template>
  <div class="w-full">
    <div
      v-if="!file"
      :class="[
        'group relative flex flex-col items-center justify-center text-center',
        'w-full cursor-pointer rounded-3xl border-2 border-dashed',
        'bg-gray-100/80 hover:bg-gray-100 transition-colors duration-200',
        'px-12 py-10 shadow-xl min-h-[30vh]',
        isDragging ? 'border-gray-900 bg-gray-100' : 'border-gray-400/70'
      ]"
      aria-label="Загрузите файл перетаскиванием или выберите его"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
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
        <p class="text-gray-500 text-sm mt-2">Максимальный размер: 10MB</p>
      </div>
      <input
        ref="fileInput"
        type="file"
        class="sr-only"
        @change="onChange"
      />
    </div>

    <!-- Отображение выбранного файла -->
    <div
      v-else
      class="group relative flex flex-col items-center justify-center text-center w-full rounded-3xl border-2 border-green-500 bg-green-50/80 px-12 py-10 shadow-xl min-h-[30vh]"
    >
      <div class="flex flex-col items-center justify-center gap-3">
        <svg class="h-12 w-12 text-green-600 mb-2" viewBox="0 0 512 512" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V304H176c-35.3 0-64 28.7-64 64V512H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM176 352h16c22.1 0 40 17.9 40 40s-17.9 40-40 40H192v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V432 384c0-17.7 14.3-32 32-32zm32 80c0-8.8-7.2-16-16-16H192v32h16c8.8 0 16-7.2 16-16zm-128-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V400c0-26.5 21.5-48 48-48zm0 32c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80zm368 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48 48c8.8 0 16-7.2 16-16s-7.2-16-16-16H464V384z"
          />
        </svg>
        <p class="text-gray-800 font-medium text-lg">{{ file.name }}</p>
        <p class="text-gray-600 text-sm">{{ formatFileSize(file.size) }}</p>
        
        <div class="flex gap-3 mt-4">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            @click="downloadFile"
          >
            <svg class="h-4 w-4" viewBox="0 0 512 512" aria-hidden="true">
              <path
                fill="currentColor"
                d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
              />
            </svg>
            Скачать
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700"
            @click="removeFile"
          >
            <svg class="h-4 w-4" viewBox="0 0 448 512" aria-hidden="true">
              <path
                fill="currentColor"
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
              />
            </svg>
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ 
  (e: 'select', file: File): void 
  (e: 'remove'): void 
}>()

const fileInput = ref<HTMLInputElement>()
const file = ref<File | null>(null)
const isDragging = ref(false)

// Триггер клика по input
const triggerFileInput = () => {
  fileInput.value?.click()
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const droppedFile = event.dataTransfer?.files?.item(0) ?? null
  if (droppedFile) {
    handleFileSelect(droppedFile)
  }
}

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const selectedFile = input?.files?.item(0) ?? null
  if (selectedFile) {
    handleFileSelect(selectedFile)
  }
}

// Обработчик выбора файла с валидацией
function handleFileSelect(selectedFile: File) {
  // Проверка размера файла (10MB)
  if (selectedFile.size > 10 * 1024 * 1024) {
    alert('Файл слишком большой. Максимальный размер: 10MB')
    return
  }
  
  file.value = selectedFile
  emit('select', selectedFile)
}

// Удаление файла
function removeFile() {
  file.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('remove')
}

// Скачивание файла
function downloadFile() {
  if (!file.value) return
  
  const url = URL.createObjectURL(file.value)
  const a = document.createElement('a')
  a.href = url
  a.download = file.value.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Форматирование размера файла
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
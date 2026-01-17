<template>
  <div>
    <h3 class="text-lg font-semibold text-slate-900 mb-4">Управление контентом сайта</h3>
    
    <div class="mb-6">
      <button
        @click="showAddForm = !showAddForm"
        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md transition text-sm font-medium"
      >
        {{ showAddForm ? '✗ Закрыть' : '+ Добавить блок' }}
      </button>
    </div>

    <div v-if="showAddForm" class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 mb-6 shadow-md">
      <div class="space-y-3">
        <select v-model="newBlock.type" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none text-sm">
          <option value="text" class="bg-slate-900">Текст</option>
          <option value="image" class="bg-slate-900">Изображение</option>
          <option value="banner" class="bg-slate-900">Баннер</option>
          <option value="section" class="bg-slate-900">Раздел</option>
        </select>
        <input v-model="newBlock.title" placeholder="Заголовок" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm" />
        <textarea v-model="newBlock.content" placeholder="Содержание" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm h-24 resize-none"></textarea>
        <input v-model="newBlock.page" placeholder="Страница (например: index, services)" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm" />
        <input v-model.number="newBlock.order" type="number" placeholder="Порядок" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm" />
        <button
          @click="addNewBlock"
          class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition text-sm font-medium"
        >
          Добавить
        </button>
      </div>
    </div>

    <div v-if="contentBlocks.length === 0" class="text-center py-8">
      <p class="text-slate-600">Нет контента</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="block in contentBlocks" :key="block.id" class="bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-1 bg-white/20 text-blue-50 border border-blue-300 rounded">{{ block.type }}</span>
              <h4 class="text-white font-semibold">{{ block.title }}</h4>
            </div>
            <p class="text-blue-100 text-sm line-clamp-2">{{ block.content }}</p>
            <div class="flex gap-4 mt-2 text-xs text-blue-100">
              <span><strong>Страница:</strong> {{ block.page }}</span>
              <span><strong>Порядок:</strong> {{ block.order }}</span>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-medium text-white',
              block.isActive && 'bg-green-500/70 border border-green-400',
              !block.isActive && 'bg-red-500/70 border border-red-400'
            ]"
          >
            {{ block.isActive ? 'Активен' : 'Неактивен' }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click="toggleBlock(block.id, !block.isActive)"
            :class="[
              'px-3 py-1 rounded-lg text-xs transition font-medium text-white',
              block.isActive
                ? 'bg-red-600 border border-red-500 hover:bg-red-700'
                : 'bg-green-600 border border-green-500 hover:bg-green-700'
            ]"
          >
            {{ block.isActive ? 'Отключить' : 'Включить' }}
          </button>
          <button
            @click="deleteBlock(block.id)"
            class="px-3 py-1 rounded-lg bg-red-600 text-white text-xs border border-red-500 hover:bg-red-700 transition font-medium"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminData } from '~/composables/useAdminData'

const { contentBlocks, addContentBlock, updateContentBlock, deleteContentBlock: deleteFunc } = useAdminData()

const showAddForm = ref(false)
const newBlock = ref({ type: 'text', title: '', content: '', page: '', order: 1 })

const addNewBlock = () => {
  if (!newBlock.value.title || !newBlock.value.content || !newBlock.value.page) {
    alert('Пожалуйста, заполните все необходимые поля')
    return
  }
  addContentBlock({ ...newBlock.value, isActive: true })
  newBlock.value = { type: 'text', title: '', content: '', page: '', order: 1 }
  showAddForm.value = false
}

const toggleBlock = (blockId: string, isActive: boolean) => {
  updateContentBlock(blockId, { isActive })
}

const deleteBlock = (blockId: string) => {
  if (confirm('Вы уверены, что хотите удалить этот блок контента?')) {
    deleteFunc(blockId)
  }
}
</script>
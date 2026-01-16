<template>
  <div>
    <h3 class="text-lg font-semibold text-white mb-4">Управление контентом сайта</h3>
    
    <div class="mb-6">
      <button
        @click="showAddForm = !showAddForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm"
      >
        {{ showAddForm ? '✕ Закрыть' : '+ Добавить блок' }}
      </button>
    </div>

    <div v-if="showAddForm" class="bg-slate-700/30 border border-white/10 rounded-lg p-4 mb-6">
      <div class="space-y-3">
        <select v-model="newBlock.type" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none text-sm">
          <option value="text">Текст</option>
          <option value="image">Изображение</option>
          <option value="banner">Баннер</option>
          <option value="section">Раздел</option>
        </select>
        <input v-model="newBlock.title" placeholder="Заголовок" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm" />
        <textarea v-model="newBlock.content" placeholder="Содержание" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm h-24 resize-none"></textarea>
        <input v-model="newBlock.page" placeholder="Страница (например: index, services)" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm" />
        <input v-model.number="newBlock.order" type="number" placeholder="Порядок" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm" />
        <button
          @click="addNewBlock"
          class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition text-sm"
        >
          Добавить
        </button>
      </div>
    </div>

    <div v-if="contentBlocks.length === 0" class="text-center py-8">
      <p class="text-gray-400">Нет контента</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="block in contentBlocks" :key="block.id" class="bg-slate-700/30 border border-white/10 rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs px-2 py-1 bg-blue-500/30 text-blue-300 rounded">{{ block.type }}</span>
              <h4 class="text-white font-semibold">{{ block.title }}</h4>
            </div>
            <p class="text-gray-400 text-sm line-clamp-2">{{ block.content }}</p>
            <div class="flex gap-4 mt-2 text-xs text-gray-500">
              <span><strong>Страница:</strong> {{ block.page }}</span>
              <span><strong>Порядок:</strong> {{ block.order }}</span>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              block.isActive && 'bg-green-500/30 text-green-300',
              !block.isActive && 'bg-red-500/30 text-red-300'
            ]"
          >
            {{ block.isActive ? 'Активен' : 'Неактивен' }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click="toggleBlock(block.id, !block.isActive)"
            :class="[
              'px-3 py-1 rounded-lg text-xs transition',
              block.isActive
                ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/50'
                : 'bg-green-600/30 text-green-300 border border-green-500/50 hover:bg-green-600/50'
            ]"
          >
            {{ block.isActive ? 'Отключить' : 'Включить' }}
          </button>
          <button
            @click="deleteBlock(block.id)"
            class="px-3 py-1 rounded-lg bg-gray-600/30 text-gray-300 text-xs border border-gray-500/50 hover:bg-gray-600/50 transition"
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

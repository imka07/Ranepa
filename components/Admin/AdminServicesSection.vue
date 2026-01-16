<template>
  <div>
    <h3 class="text-lg font-semibold text-white mb-4">Управление услугами</h3>
    
    <div class="mb-6">
      <button
        @click="showAddForm = !showAddForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm"
      >
        {{ showAddForm ? '✕ Закрыть' : '+ Добавить услугу' }}
      </button>
    </div>

    <div v-if="showAddForm" class="bg-slate-700/30 border border-white/10 rounded-lg p-4 mb-6">
      <div class="space-y-3">
        <input v-model="newService.name" placeholder="Название услуги" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm" />
        <input v-model="newService.description" placeholder="Описание услуги" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm" />
        <input v-model="newService.category" placeholder="Категория" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm" />
        <input v-model.number="newService.price" type="number" placeholder="Цена" class="w-full px-3 py-2 rounded-lg bg-slate-600/50 text-white border border-white/20 focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm" />
        <button
          @click="addNewService"
          class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition text-sm"
        >
          Добавить
        </button>
      </div>
    </div>

    <div v-if="services.length === 0" class="text-center py-8">
      <p class="text-gray-400">Нет услуг</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="service in services" :key="service.id" class="bg-slate-700/30 border border-white/10 rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="text-white font-semibold">{{ service.name }}</h4>
            <p class="text-gray-400 text-sm">{{ service.description }}</p>
            <div class="flex gap-4 mt-2 text-xs text-gray-400">
              <span><strong class="text-blue-400">Категория:</strong> {{ service.category }}</span>
              <span><strong class="text-green-400">Цена:</strong> {{ service.price }} ₽</span>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              service.isActive && 'bg-green-500/30 text-green-300',
              !service.isActive && 'bg-red-500/30 text-red-300'
            ]"
          >
            {{ service.isActive ? 'Активна' : 'Неактивна' }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click="toggleService(service.id, !service.isActive)"
            :class="[
              'px-3 py-1 rounded-lg text-xs transition',
              service.isActive
                ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/50'
                : 'bg-green-600/30 text-green-300 border border-green-500/50 hover:bg-green-600/50'
            ]"
          >
            {{ service.isActive ? 'Отключить' : 'Включить' }}
          </button>
          <button
            @click="deleteService(service.id)"
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

const { services, addService, updateService, deleteService: deleteFunc } = useAdminData()

const showAddForm = ref(false)
const newService = ref({ name: '', description: '', category: '', price: 0 })

const addNewService = () => {
  if (!newService.value.name || !newService.value.description || !newService.value.category || !newService.value.price) {
    alert('Пожалуйста, заполните все поля')
    return
  }
  addService({ ...newService.value, isActive: true })
  newService.value = { name: '', description: '', category: '', price: 0 }
  showAddForm.value = false
}

const toggleService = (serviceId: string, isActive: boolean) => {
  updateService(serviceId, { isActive })
}

const deleteService = (serviceId: string) => {
  if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
    deleteFunc(serviceId)
  }
}
</script>

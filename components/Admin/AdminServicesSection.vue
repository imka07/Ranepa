<template>
  <div>
    <h3 class="text-lg font-semibold text-slate-900 mb-4">Управление услугами</h3>
    
    <div class="mb-6">
      <button
        @click="showAddForm = !showAddForm"
        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md transition text-sm font-medium"
      >
        {{ showAddForm ? '✗ Закрыть' : '+ Добавить услугу' }}
      </button>
    </div>

    <div v-if="showAddForm" class="bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg p-4 mb-6 shadow-md">
      <div class="space-y-3">
        <input v-model="newService.name" placeholder="Название услуги" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm" />
        <input v-model="newService.description" placeholder="Описание услуги" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm" />
        <input v-model="newService.category" placeholder="Категория" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm" />
        <input v-model.number="newService.price" type="number" placeholder="Цена" class="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-blue-300 focus:border-white focus:outline-none placeholder-blue-100 text-sm" />
        <button
          @click="addNewService"
          class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition text-sm font-medium"
        >
          Добавить
        </button>
      </div>
    </div>

    <div v-if="services.length === 0" class="text-center py-8">
      <p class="text-slate-600">Нет услуг</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="service in services" :key="service.id" class="bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="text-white font-semibold">{{ service.name }}</h4>
            <p class="text-blue-100 text-sm">{{ service.description }}</p>
            <div class="flex gap-4 mt-2 text-xs text-blue-100">
              <span><strong class="text-blue-50">Категория:</strong> {{ service.category }}</span>
              <span><strong class="text-blue-50">Цена:</strong> {{ service.price }} ₽</span>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-medium text-white',
              service.isActive && 'bg-green-500/70 border border-green-400',
              !service.isActive && 'bg-red-500/70 border border-red-400'
            ]"
          >
            {{ service.isActive ? 'Активна' : 'Неактивна' }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click="toggleService(service.id, !service.isActive)"
            :class="[
              'px-3 py-1 rounded-lg text-xs transition font-medium text-white',
              service.isActive
                ? 'bg-red-600 border border-red-500 hover:bg-red-700'
                : 'bg-green-600 border border-green-500 hover:bg-green-700'
            ]"
          >
            {{ service.isActive ? 'Отключить' : 'Включить' }}
          </button>
          <button
            @click="deleteService(service.id)"
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
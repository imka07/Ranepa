<template>
    <div 
      v-if="show" 
      :class="[
        'border px-4 py-3 rounded mb-4',
        typeClasses,
        className
      ]"
    >
      <div :class="['flex items-center', !dismissible && !$slots.actions ? 'justify-between' : '']">
        <div class="flex items-start">
          <div v-if="showIcon" class="flex-shrink-0 mr-3">
            <BaseIcon :name="iconName" :color="iconColor" size-preset="md" />
          </div>
          <div>
            <p v-if="title" class="font-medium" :class="titleColorClass">{{ title }}</p>
            <div :class="descriptionClass">
              <slot>{{ message }}</slot>
            </div>
          </div>
        </div>
        
        <div v-if="$slots.actions" class="flex ml-auto">
          <slot name="actions"></slot>
        </div>
        
        <button 
          v-else-if="dismissible" 
          @click="dismiss"
          class="ml-auto -mx-1.5 -my-1.5 p-1.5 hover:bg-opacity-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="dismissButtonClass"
        >
          <span class="sr-only">Dismiss</span>
          <BaseIcon name="heroicons:x-mark" size-preset="sm" :color="iconColor" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue';
  
  defineOptions({
    name: 'BaseAlert',
  });
  
  const props = defineProps({
    /** Alert type */
    type: {
      type: String,
      default: 'info',
      validator: (value: string) => 
        ['success', 'info', 'warning', 'error', 'default'].includes(value)
    },
    /** Alert title */
    title: {
      type: String,
      default: ''
    },
    /** Alert message */
    message: {
      type: String,
      default: ''
    },
    /** Whether the alert is visible */
    show: {
      type: Boolean,
      default: true
    },
    /** Whether the alert can be dismissed */
    dismissible: {
      type: Boolean,
      default: false
    },
    /** Whether to show the icon */
    showIcon: {
      type: Boolean,
      default: true
    },
    /** Additional CSS classes */
    className: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['dismiss']);
  const show = ref(props.show);
  
  // Get appropriate classes for the alert type
  const typeClasses = computed(() => {
    switch (props.type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  });
  
  // Get appropriate icon for the alert type
  const iconName = computed(() => {
    switch (props.type) {
      case 'success':
        return 'heroicons:check-circle';
      case 'info':
        return 'heroicons:information-circle';
      case 'warning':
        return 'heroicons:exclamation-triangle';
      case 'error':
        return 'heroicons:x-circle';
      default:
        return 'heroicons:information-circle';
    }
  });
  
  // Get appropriate icon color for the alert type
  const iconColor = computed(() => {
    switch (props.type) {
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'gray';
    }
  });
  
  // Get appropriate title color class
  const titleColorClass = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-800';
      case 'info':
        return 'text-blue-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  });
  
  // Get appropriate description color class
  const descriptionClass = computed(() => {
    switch (props.type) {
      case 'success':
        return 'text-green-700';
      case 'info':
        return 'text-blue-700';
      case 'warning':
        return 'text-yellow-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  });
  
  // Get appropriate dismiss button class
  const dismissButtonClass = computed(() => {
    switch (props.type) {
      case 'success':
        return 'bg-green-200 hover:bg-green-300 focus:ring-green-400';
      case 'info':
        return 'bg-blue-200 hover:bg-blue-300 focus:ring-blue-400';
      case 'warning':
        return 'bg-yellow-200 hover:bg-yellow-300 focus:ring-yellow-400';
      case 'error':
        return 'bg-red-200 hover:bg-red-300 focus:ring-red-400';
      default:
        return 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-400';
    }
  });
  
  // Dismiss the alert
  const dismiss = () => {
    show.value = false;
    emit('dismiss');
  };
  </script> 
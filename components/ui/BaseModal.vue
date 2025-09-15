<template>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
          <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div class="fixed inset-0 transition-opacity bg-black bg-opacity-50" @click.self="closeOnBackdropClick && closeModal()"></div>
            
            <div 
              :class="[
                'relative bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full',
                size === 'sm' ? 'sm:max-w-sm' : 
                size === 'md' ? 'sm:max-w-md' : 
                size === 'lg' ? 'sm:max-w-lg' : 
                size === 'xl' ? 'sm:max-w-xl' : 
                size === '2xl' ? 'sm:max-w-2xl' : 
                size === '3xl' ? 'sm:max-w-3xl' : 
                size === '4xl' ? 'sm:max-w-4xl' : 
                size === '5xl' ? 'sm:max-w-5xl' : 
                size === 'full' ? 'sm:max-w-full' : '',
                className
              ]"
            >
              <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div v-if="showClose" class="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="closeModal"
                  >
                    <span class="sr-only">Close</span>
                    <Icon name="heroicons:x-mark" class="h-6 w-6" />
                  </button>
                </div>
                
                <div v-if="title || $slots.header" class="mb-4">
                  <slot name="header">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
                  </slot>
                </div>
                
                <div>
                  <slot></slot>
                </div>
              </div>
              
              <div v-if="$slots.footer" class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <slot name="footer"></slot>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  defineOptions({
    name: 'BaseModal'
  });
  
  const props = defineProps({
    /** Whether the modal is visible */
    modelValue: {
      type: Boolean,
      default: false
    },
    /** Modal title */
    title: {
      type: String,
      default: ''
    },
    /** Whether to show the close button */
    showClose: {
      type: Boolean,
      default: true
    },
    /** Whether clicking on the backdrop should close the modal */
    closeOnBackdropClick: {
      type: Boolean,
      default: true
    },
    /** Modal size */
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'full'].includes(value)
    },
    /** Additional CSS classes */
    className: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'close']);
  
  const closeModal = () => {
    emit('update:modelValue', false);
    emit('close');
  };
  
  defineExpose({
    close: closeModal
  });
  </script>
  
  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-enter-active .relative,
  .modal-leave-active .relative {
    transition: transform 0.3s ease;
  }
  
  .modal-enter-from .relative,
  .modal-leave-to .relative {
    transform: scale(0.95);
  }
  </style> 
<template>
    <div :class="[className]">
      <label v-if="label" :for="id" class="block text-sm font-medium text-white mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <div class="relative">
        <div 
          v-if="prependIcon" 
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <Icon :name="prependIcon" class="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          :id="id"
          ref="input"
          v-bind="$attrs"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :class="[
            'w-full border text-left text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
            prependIcon ? 'pl-10' : 'pl-3',
            appendIcon ? 'pr-10' : 'pr-3',
            sizeClasses,
            roundedClasses,
            errorMessage ? 'border-red-300' : 'border-gray-300',
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          ]"
          @input="updateValue"
          @blur="$emit('blur', $event)"
          @focus="$emit('focus', $event)"
        />
        
        <div 
          v-if="appendIcon" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <Icon :name="appendIcon" class="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <p v-if="errorMessage" class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
      <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">{{ helperText }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { PropType } from 'vue';
  
  defineOptions({
    name: 'BaseInput',
    inheritAttrs: false
  });
  
  const props = defineProps({
    /** Value bound to the input */
    modelValue: {
      type: [String, Number],
      default: ''
    },
    /** Input ID - auto-generated if not provided */
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 9)}`
    },
    /** Label for the input */
    label: {
      type: String,
      default: ''
    },
    /** Input placeholder */
    placeholder: {
      type: String,
      default: ''
    },
    /** Input type (text, password, email, etc.) */
    type: {
      type: String,
      default: 'text'
    },
    /** Helper text shown below the input */
    helperText: {
      type: String,
      default: ''
    },
    /** Error message shown below the input */
    errorMessage: {
      type: String,
      default: ''
    },
    /** Whether the input is disabled */
    disabled: {
      type: Boolean,
      default: false
    },
    /** Whether the input is required */
    required: {
      type: Boolean,
      default: false
    },
    /** Input size */
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
    },
    /** Input border radius */
    rounded: {
      type: String,
      default: 'md',
      validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
    },
    /** Iconify icon name to prepend */
    prependIcon: {
      type: String,
      default: ''
    },
    /** Iconify icon name to append */
    appendIcon: {
      type: String,
      default: ''
    },
    /** Additional CSS classes */
    className: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'blur', 'focus']);
  const input = ref<HTMLInputElement | null>(null);
  
  // Update value on input
  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  };
  
  // Focus the input
  const focus = () => {
    input.value?.focus();
  };
  
  // Dynamic classes based on props
  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'py-1 text-xs';
      case 'md':
        return 'py-2 text-sm';
      case 'lg':
        return 'py-3 text-base';
      default:
        return 'py-2 text-sm';
    }
  });
  
  const roundedClasses = computed(() => {
    switch (props.rounded) {
      case 'none':
        return 'rounded-none';
      case 'sm':
        return 'rounded';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case '2xl':
        return 'rounded-2xl';
      case '3xl':
        return 'rounded-3xl';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-md';
    }
  });
  
  // Expose methods
  defineExpose({
    focus
  });
  </script> 
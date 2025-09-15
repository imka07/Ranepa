<template>
    <div class="w-full">
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <div class="relative">
        <select
          :id="id"
          ref="select"
          v-bind="$attrs"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          :class="[
            'block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none',
            roundedClasses,
            errorMessage ? 'border-red-300' : 'border-gray-300',
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
            className
          ]"
          @change="updateValue"
          @blur="$emit('blur', $event)"
          @focus="$emit('focus', $event)"
        >
          <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
          <slot></slot>
        </select>
        
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <p v-if="errorMessage" class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
      <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">{{ helperText }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  defineOptions({
    name: 'BaseSelect',
    inheritAttrs: false
  });
  
  const props = defineProps({
    /** Value bound to the select */
    modelValue: {
      type: [String, Number],
      default: ''
    },
    /** Select ID - auto-generated if not provided */
    id: {
      type: String,
      default: () => `select-${Math.random().toString(36).substring(2, 9)}`
    },
    /** Label for the select */
    label: {
      type: String,
      default: ''
    },
    /** Placeholder text */
    placeholder: {
      type: String,
      default: ''
    },
    /** Helper text shown below the select */
    helperText: {
      type: String,
      default: ''
    },
    /** Error message shown below the select */
    errorMessage: {
      type: String,
      default: ''
    },
    /** Whether the select is disabled */
    disabled: {
      type: Boolean,
      default: false
    },
    /** Whether the select is required */
    required: {
      type: Boolean,
      default: false
    },
    /** Select border radius */
    rounded: {
      type: String,
      default: 'md',
      validator: (value: string) => ['none', 'sm', 'md', 'lg'].includes(value)
    },
    /** Additional CSS classes */
    className: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'blur', 'focus']);
  const select = ref<HTMLSelectElement | null>(null);
  
  // Update value on change
  const updateValue = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
  };
  
  // Focus the select
  const focus = () => {
    select.value?.focus();
  };
  
  // Dynamic classes based on props
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
      default:
        return 'rounded-md';
    }
  });
  
  // Expose methods
  defineExpose({
    focus
  });
  </script> 
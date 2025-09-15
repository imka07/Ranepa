<template>
    <div class="w-full">
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <textarea
        :id="id"
        ref="textarea"
        v-bind="$attrs"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        :class="[
          'w-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors px-3',
          roundedClasses,
          errorMessage ? 'border-red-300' : 'border-gray-300',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          'text-sm py-2',
          className
        ]"
        @input="updateValue"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      ></textarea>
      
      <p v-if="errorMessage" class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
      <p v-else-if="helperText" class="mt-1 text-sm text-gray-500">{{ helperText }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  defineOptions({
    name: 'BaseTextarea',
    inheritAttrs: false
  });
  
  const props = defineProps({
    /** Value bound to the textarea */
    modelValue: {
      type: String,
      default: ''
    },
    /** Textarea ID - auto-generated if not provided */
    id: {
      type: String,
      default: () => `textarea-${Math.random().toString(36).substring(2, 9)}`
    },
    /** Label for the textarea */
    label: {
      type: String,
      default: ''
    },
    /** Textarea placeholder */
    placeholder: {
      type: String,
      default: ''
    },
    /** Number of rows */
    rows: {
      type: Number,
      default: 3
    },
    /** Helper text shown below the textarea */
    helperText: {
      type: String,
      default: ''
    },
    /** Error message shown below the textarea */
    errorMessage: {
      type: String,
      default: ''
    },
    /** Whether the textarea is disabled */
    disabled: {
      type: Boolean,
      default: false
    },
    /** Whether the textarea is required */
    required: {
      type: Boolean,
      default: false
    },
    /** Textarea border radius */
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
  const textarea = ref<HTMLTextAreaElement | null>(null);
  
  // Update value on input
  const updateValue = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:modelValue', target.value);
  };
  
  // Focus the textarea
  const focus = () => {
    textarea.value?.focus();
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
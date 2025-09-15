<template>
    <component
      :is="to ? 'NuxtLink' : 'button'"
      :to="to"
      :class="[
        'inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
        variantClasses,
        sizeClasses,
        { 'opacity-50 cursor-not-allowed': disabled },
        roundedClasses,
        fullWidth ? 'w-full' : '',
        className
      ]"
      :disabled="disabled || loading"
      :type="!to ? type : undefined"
      @click="$emit('click', $event)"
    >
      <span v-if="loading" class="mr-2">
        <slot name="loading-icon">
          <Icon name="svg-spinners:180-ring" class="animate-spin h-4 w-4" />
        </slot>
      </span>
      <slot />
    </component>
  </template>
  
  <script setup lang="ts">
  import type { PropType } from 'vue';
  
  defineOptions({
    name: 'BaseButton',
  });
  
  const props = defineProps({
    /** The button's visual variant */
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => 
        ['primary', 'secondary', 'outline', 'danger', 'success', 'text'].includes(value)
    },
    /** The button's size */
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
    },
    /** Whether the button is disabled */
    disabled: {
      type: Boolean,
      default: false
    },
    /** Whether the button is in a loading state */
    loading: {
      type: Boolean,
      default: false
    },
    /** The button HTML type attribute */
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    /** Whether the button should take the full width of its container */
    fullWidth: {
      type: Boolean,
      default: false
    },
    /** The button's border radius style */
    rounded: {
      type: String,
      default: 'md',
      validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
    },
    /** Optional path to navigate to (turns button into NuxtLink) */
    to: {
      type: [String, Object],
      default: undefined
    },
    /** Additional CSS classes */
    className: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['click']);
  
  // Dynamic classes based on props
  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-[#6340ff] hover:bg-[#0219c0] text-white border border-transparent';
      case 'secondary':
        return 'bg-white hover:bg-gray-200 text-gray-700 border border-transparent';
      case 'outline':
        return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border border-transparent';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border border-transparent';
      case 'text':
        return 'bg-transparent hover:bg-gray-100 text-blue-600 hover:text-blue-800 border border-transparent';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent';
    }
  });
  
  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'text-xs px-2.5 py-1.5';
      case 'md':
        return 'text-sm px-4 py-2';
      case 'lg':
        return 'text-base px-6 py-3';
      default:
        return 'text-sm px-4 py-2';
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
  </script> 
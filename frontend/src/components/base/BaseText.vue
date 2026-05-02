<script setup>
/**
 * @file BaseText.vue
 * @description Unified Typography component for Ebraa ERP.
 * Handles different text types and ensures theme-aware colors.
 */
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'body', // h1, h2, h3, h4, body, muted, caption, label
  },
  weight: {
    type: String,
    default: 'medium', // black, bold, medium, regular
  },
  color: {
    type: String,
    default: 'default', // default, primary, emerald, amber, red
  },
  size: {
    type: String,
    default: '', // Optional override (e.g., text-sm, text-4xl)
  }
})

const classes = computed(() => {
  const base = {
    'h1': 'text-3xl md:text-5xl font-black text-[var(--text-title)] tracking-tight',
    'h2': 'text-2xl md:text-3xl font-black text-[var(--text-title)] tracking-tight',
    'h3': 'text-xl md:text-2xl font-black text-[var(--text-title)] tracking-tight',
    'h4': 'text-lg md:text-xl font-black text-[var(--text-title)]',
    'body': 'text-base font-medium text-[var(--text-main)]',
    'muted': 'text-sm font-medium text-[var(--text-muted)]',
    'caption': 'text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]',
    'label': 'text-xs md:text-sm font-black uppercase tracking-widest text-[var(--text-main)] opacity-80'
  }

  const weightClasses = {
    'black': 'font-black',
    'bold': 'font-bold',
    'medium': 'font-medium',
    'regular': 'font-normal'
  }

  const colorClasses = {
    'default': '',
    'primary': '!text-primary-500',
    'emerald': '!text-emerald-500',
    'amber': '!text-amber-500',
    'red': '!text-red-500',
    'danger': '!text-red-600 dark:!text-red-400 font-bold'
  }

  return [
    base[props.type] || base.body,
    weightClasses[props.weight],
    colorClasses[props.color],
    props.size
  ].join(' ')
})
</script>

<template>
  <component :is="type.startsWith('h') ? type : 'p'" :class="classes">
    <slot />
  </component>
</template>

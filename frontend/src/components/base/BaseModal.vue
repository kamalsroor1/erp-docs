<script setup>
/**
 * @file BaseModal.vue
 * @description Unified Modal component for Ebraa ERP.
 * Features: Glassmorphism, Theme-aware, Responsive, and Unified Padding.
 */
import Dialog from 'primevue/dialog'
import BaseText from './BaseText.vue'
import { X } from 'lucide-vue-next'
import Button from 'primevue/button'

const props = defineProps({
  visible: Boolean,
  title: String,
  width: {
    type: String,
    default: 'max-w-2xl'
  },
  loading: Boolean,
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'close'])

const ptOptions = {
  root: { class: 'glass-dark !border-[var(--border-color)] !rounded-[2.5rem] shadow-2xl overflow-hidden !bg-[var(--card-bg)]' },
  header: { class: '!bg-slate-50 dark:!bg-white/5 !border-b !border-[var(--border-color)] !p-8 flex items-center justify-between' },
  title: { class: '!m-0' }, // We use our own title template
  content: { class: '!p-8 !bg-transparent' },
  footer: { class: '!p-8 !bg-slate-50/50 dark:!bg-white/5 !border-t !border-[var(--border-color)]' },
  closeButton: { class: 'hidden' } // We use our own close button for better design
}
</script>

<template>
  <Dialog 
    :visible="visible" 
    @update:visible="emit('update:visible', $event)"
    modal 
    :dismissableMask="closable"
    class="w-full mx-4"
    :class="width"
    :pt="ptOptions"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <BaseText type="h3">{{ title }}</BaseText>
        <Button 
          v-if="closable"
          @click="emit('update:visible', false)" 
          text 
          rounded 
          severity="secondary" 
          class="!p-2 hover:!bg-red-500/10 hover:!text-red-500 transition-colors"
        >
          <X class="w-6 h-6" />
        </Button>
      </div>
    </template>

    <div class="modal-body-container">
      <slot />
    </div>

    <template #footer v-if="$slots.footer">
      <div class="flex gap-4 justify-end">
        <slot name="footer" />
      </div>
    </template>
  </Dialog>
</template>

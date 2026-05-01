<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import POSLayout from './layouts/POSLayout.vue'

const route = useRoute()

const layouts = {
  AppLayout,
  AuthLayout,
  POSLayout
}

const layout = computed(() => {
  const layoutName = route.meta.layout || 'AppLayout'
  return layouts[layoutName]
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style>
/* Global transitions or styles */
</style>

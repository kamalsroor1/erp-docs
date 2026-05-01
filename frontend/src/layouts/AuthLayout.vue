<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#0f172a] text-white p-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
    </div>
    
    <div class="relative z-10 w-full max-w-md">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gptConfig, gptConfig2 } from '../config'
import { useToggle } from '@vueuse/core'

const [value, toggle] = useToggle()
</script>

<template>
  <div><NuxtLink to="/advertising-ssr/">To prev</NuxtLink></div>
  <GlobalAdvertisingProvider :config="value ? gptConfig : gptConfig2">
    <div :style="{ height: '100vh', position: 'relative' }">
      <button @click="toggle()">click to change config</button>
      <GlobalAdvertisingSlot id="banner-ad" :is-sticky="true" />
    </div>
  </GlobalAdvertisingProvider>
  <div :style="{ marginTop: '100vh' }">test bottom</div>
</template>

<script lang="ts" setup>
import { gptConfig, gptConfig2 } from '../config'
import { useToggle } from '@vueuse/core'

const [value, toggle] = useToggle()
</script>

<template>
  <div><NuxtLink to="/advertising/">To prev</NuxtLink></div>
  <AdvertisingProvider :config="value ? gptConfig : gptConfig2">
    <div :style="{ height: '100vh', position: 'relative' }">
      <button @click="toggle()">click to change config</button>
      <AdvertisingSlot id="banner-ad" :is-sticky="true" />
    </div>
    <div :style="{ marginTop: '100vh' }">test bottom</div>
  </AdvertisingProvider>
</template>

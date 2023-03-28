<script lang="ts" setup>
import { gptConfig } from '../config'
import { ref, onBeforeMount } from 'vue'
import { useHead } from '@unhead/vue'

const backgroundColor = ref('red')
const blueBackground = () => {
  backgroundColor.value = 'blue'
}

onBeforeMount(() => {
  useHead({
    script: [{ children: 'parent.postMessage("BlueBackground:banner-ad", "*")' }],
  })
})
</script>

<template>
  <div>
    <div><NuxtLink to="/advertising/">To prev</NuxtLink></div>
    <AdvertisingProvider :config="gptConfig">
      <div :style="{ backgroundColor }">
        <h1>Hello World</h1>
        <AdvertisingSlot id="banner-ad" :custom-event-handlers="{ blueBackground }" />
      </div>
    </AdvertisingProvider>
  </div>
</template>

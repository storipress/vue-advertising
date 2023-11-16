<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { ref } from 'vue'
import { LazyHydrationWrapper } from 'vue3-lazy-hydration'
import type { TStickySetting } from './utils/'

const props = withDefaults(
  defineProps<{
    id: string
    style?: object
    isSticky?: boolean
    stickySetting?: TStickySetting
    className?: string
    children?: string | number | null
    customEventHandlers?: Record<string, () => void>
  }>(),
  {
    customEventHandlers: () => ({}),
    isSticky: false,
    stickySetting: () => {
      return {
        time: 3000,
        top: 0,
      }
    },
  },
)

const nowSticky = ref(true)

if (props.isSticky) {
  setTimeout(() => {
    nowSticky.value = false
  }, props.stickySetting.time)
}

useHead({
  script: [
    {
      children: `global_proxy_list.push('${props.id}'); global_custom_events.push('${props.customEventHandlers}')`,
    },
  ],
})
</script>

<template>
  <LazyHydrationWrapper>
    <div :class="isSticky && nowSticky && 'isSticky'" :style="`--sticky-top: ${props.stickySetting.top}px`">
      <div :id="id" v-bind="$attrs">
        <slot />
      </div>
    </div>
  </LazyHydrationWrapper>
</template>

<style lang="scss">
.isSticky {
  position: sticky;
  top: var(--sticky-top);
}
</style>

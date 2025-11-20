<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import { useAdvertisingContextWithDefault } from '../AdvertisingContext'
import calculateRootMargin from './utils/calculateRootMargin'
import isLazyLoading from './utils/isLazyLoading'
import getLazyLoadConfig from './utils/getLazyLoadConfig'
import type { TStickySetting } from './utils/'
import { ref, watchEffect } from 'vue'

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
const observerRef = ref<HTMLElement | null>(null)
const { activate, config } = useAdvertisingContextWithDefault()
const lazyLoadConfig = getLazyLoadConfig(config.value, props.id)
const isLazyLoadEnabled = isLazyLoading(lazyLoadConfig)
const nowSticky = ref(true)

if (props.isSticky) {
  setTimeout(() => {
    nowSticky.value = false
  }, props.stickySetting.time)
}

watchEffect(
  (onCleanup) => {
    if (!config.value || !isLazyLoadEnabled || !activate.value) {
      return
    }

    const rootMargin = calculateRootMargin(lazyLoadConfig)
    const { stop } = useIntersectionObserver(
      observerRef,
      async ([{ isIntersecting }]) => {
        if (isIntersecting) {
          const { id, customEventHandlers } = props
          activate.value?.(id, customEventHandlers)
          stop()
        }
      },
      {
        rootMargin,
      },
    )

    onCleanup(stop)
  },
  { flush: 'post' },
)

watchEffect(
  () => {
    if (!config?.value || isLazyLoadEnabled || !activate.value) {
      return
    }
    const { id, customEventHandlers } = props
    activate.value(id, customEventHandlers)
  },
  { flush: 'post' },
)
</script>

<template>
  <div :class="isSticky && nowSticky && 'isSticky'" :style="`--sticky-top: ${props.stickySetting.top}px`">
    <div :id="id" ref="observerRef" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.isSticky {
  position: sticky;
  top: var(--sticky-top);
}
</style>

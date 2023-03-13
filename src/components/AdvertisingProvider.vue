<script lang="ts" setup>
import equal from '@guanghechen/fast-deep-equal'
import Advertising from '../Advertising'
import { useProvideAdvertisingContext } from '../AdvertisingContext'
import type { TAdvertisingConfig } from './utils/'
import { useHead } from '@unhead/vue'
import { shallowRef, computed, ref, onMounted, watchEffect, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    isPrebid?: boolean
    config: TAdvertisingConfig
    onError?: () => void
    plugins?: {
      setupPrebid?: () => void
      setupGpt?: () => void
      teardownPrebid?: () => void
      teardownGpt?: () => void
    }[]
  }>(),
  {
    active: true,
    isPrebid: false,
  }
)

const { config, plugins, isPrebid, onError } = props
const advertising = shallowRef<Advertising | null>(new Advertising(config, plugins, onError))
const activate = computed(() => advertising.value?.activate.bind(advertising.value))
const nowConfig = ref<TAdvertisingConfig | null>(config)

useHead({
  script: [
    { async: true, src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js' },
    isPrebid ? { async: true, src: 'https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js' } : {},
  ],
})

useProvideAdvertisingContext({ activate, config: nowConfig })

onMounted(async () => {
  const { active } = props
  initialize()
  if (advertising.value?.isConfigReady() && active) {
    await advertising.value?.setup()
  }
})

onUnmounted(async () => {
  const { config } = props
  if (config) {
    await teardown()
  }
})

async function teardown() {
  nowConfig.value = null
  await advertising.value?.teardown()
  advertising.value = null
}

function initialize() {
  const { config, plugins, onError } = props
  advertising.value = new Advertising(config, plugins, onError)
}

watch(
  () => props.config,
  async (newConfig, oldConfig) => {
    if (!advertising.value) {
      return
    }

    const isConfigReady = advertising.value.isConfigReady()

    if (isConfigReady && !equal(newConfig, oldConfig)) {
      await teardown()

      // re-initialize advertising, if it is active
      if (props.active) {
        initialize()
        if (advertising.value.isConfigReady()) {
          await advertising.value.setup()
        }

        nowConfig.value = advertising.value.config
      }
    }
  }
)

watchEffect(async () => {
  if (!advertising.value) {
    return
  }

  const { config, active } = props
  const isConfigReady = advertising.value.isConfigReady()
  // activate advertising when the config changes from `undefined`
  if (!isConfigReady && config && active) {
    advertising.value.setConfig(config)
    await advertising.value.setup()

    if (advertising) {
      nowConfig.value = advertising.value.config
    }
  }
})
</script>

<template>
  <slot />
</template>

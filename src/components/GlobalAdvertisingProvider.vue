<script lang="ts" setup>
import equal from '@guanghechen/fast-deep-equal'
import { useHead } from '@unhead/vue'
import { toRaw, onUnmounted, watch } from 'vue'
import Advertising from '../Advertising'
import type { TAdvertisingConfig } from './utils/'

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
  },
)

const { config, plugins, isPrebid, onError } = props

useHead({
  script: [
    { async: true, src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js' },
    isPrebid ? { async: true, src: 'https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js' } : {},
  ],
})

useHead({
  script: [
    {
      children: `var googletag = googletag || {}; googletag.cmd = googletag.cmd || [];`,
    },
    {
      children: `var pbjs = pbjs || {}; pbjs.que = pbjs.que || []; var global_proxy_list = []; var global_custom_events = []`,
    },
    {
      children: `var global_advertising = ${Advertising}`,
    },
    {
      children: `var new_global_advertising = new global_advertising(${JSON.stringify(
        toRaw(config),
      )}, ${plugins}, ${onError})`,
    },
    {
      children: `async function setup_advertising() { await new_global_advertising.setup(); global_proxy_list.forEach((id, index) => { new_global_advertising.activate(id, global_custom_events[index]) })}`,
    },
    {
      children: 'setup_advertising()',
    },
  ],
})

onUnmounted(async () => {
  const { config } = props
  if (config) {
    await new_global_advertising.teardown()
  }
})

watch(
  () => props.config,
  async (newConfig, oldConfig) => {
    const isConfigReady = new_global_advertising.isConfigReady()

    if (isConfigReady && !equal(newConfig, oldConfig)) {
      await new_global_advertising.teardown()
      new_global_advertising = new global_advertising(newConfig, plugins, props.onError)
      if (new_global_advertising.isConfigReady()) {
        await setup_advertising()
      }
    }
  },
)
</script>

<template>
  <slot />
</template>

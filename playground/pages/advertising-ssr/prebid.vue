<script lang="ts" setup>
import { prebidConfig } from '../config'
</script>

<template>
  <div>
    <div><NuxtLink to="/advertising-ssr/">To prev</NuxtLink></div>
    <GlobalAdvertisingProvider :config="prebidConfig" :is-prebid="true">
      <div>
        <h1>Hello World</h1>
        <GlobalAdvertisingSlot id="banner-ad" />
        <GlobalAdvertisingSlot id="prebid-2" />
      </div>
    </GlobalAdvertisingProvider>
  </div>
</template>

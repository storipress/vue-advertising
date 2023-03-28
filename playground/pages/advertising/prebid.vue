<script lang="ts" setup>
import { prebidConfig } from '../config'
</script>

<template>
  <div>
    <div><NuxtLink to="/advertising/">To prev</NuxtLink></div>
    <AdvertisingProvider :config="prebidConfig" :is-prebid="true">
      <div>
        <h1>Hello World</h1>
        <AdvertisingSlot id="banner-ad" />
        <AdvertisingSlot id="prebid-2" />
      </div>
    </AdvertisingProvider>
  </div>
</template>

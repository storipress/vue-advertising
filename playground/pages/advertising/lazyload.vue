<script lang="ts" setup>
import { lazyloadConfig } from '../config'
</script>

<template>
  <div>
    <div><NuxtLink to="/advertising/">To prev</NuxtLink></div>
    <AdvertisingProvider :config="lazyloadConfig">
      <div>
        <h1>Hello World</h1>
        <AdvertisingSlot id="gpt-ad01" />
        <div :style="{ height: '100vh' }" />
        <AdvertisingSlot id="gpt-ad02" />
        <div :style="{ height: '100vh' }" />
        <AdvertisingSlot id="gpt-ad03" />
        <div :style="{ height: '100vh' }" />
        <AdvertisingSlot id="gpt-ad04" />
      </div>
    </AdvertisingProvider>
  </div>
</template>

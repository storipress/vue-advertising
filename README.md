![vue-advertising](https://user-images.githubusercontent.com/53453555/224681952-d6121325-2397-43e3-b624-3d37d2e09013.png)

<div align="center"><strong>Vue Advertising</strong></div>
<div align="center">A JavaScript library for display ads in <a href="https://vuejs.org" target="_blank" rel="noopener noreferer">Vue</a> applications.</div>
<br />
<div align="center">
<a href="https://storipress.com">Website</a> 
<span> · </span>
<a href="https://github.com/storipress/vue-advertising">GitHub</a> 
<span> · </span>
<a href="https://join.slack.com/t/storipresscommunity/shared_invite/zt-1krx5nm1d-h_WKy1XF3MSxuY4BQ0VRbQ">Slack</a>
</div>

## Introduction

Integrate ads in your app the “Vue way". A set of helpers for integrating complex advertising setups in Vue projects. It reduces the pain of integrating advertising in server side rendered projects. It also takes care of bloat by centralising configuration.

## Why

We believe publishing is core to any modern society. However, it is getting more and more difficult to monetise content with advertising, and use modern development tools. Advertising needs a revmp. A renovation. Modernised for the way we create content today.

- One central configuration file for all your Google Publisher Tags and Prebid placements (Prebid is optional)
- One provider component that handles all the “plumbing” with googletag and pbjs, nicely hidden away
- Ad slot components that get filled with creatives from the ad server when they mount to the DOM
- Works well in single page applications with multiple routes
- Suitable for server-side-rendering
- Supports lazy loading, even for Prebid ads, individually configurable per ad slot

## Prerequisites

### Google Ad Manager
To use it, you need to have a [Google Ad Manager](https://admanager.google.com) account set up to deliver display ads through [Google Publisher Tags](https://developers.google.com/publisher-tag/guides/get-started) (GPT).

Optionally, vue-advertising supports use of real-time header bidding with [Prebid](https://docs.prebid.org/overview/intro.html).

### Dependencies

Please note that vue-advertising requires [`@vueuse/head`](https://github.com/vueuse/head) or [`@unhead/vue`](https://github.com/unjs/unhead) to manage and load scripts. Please make sure you are using a [Nuxt](https://nuxt.com) project or have set up `@vueuse/head` or `@unhead/vue` in your project.


## Documentation
You can find more info on [react-advertising](https://github.com/KijijiCA/react-advertising)

Below is the basic usage of vue-advertising

### Set up your ad providers

1. Create your `GPT` config

```
const gptConfig = {
  slots: [
    {
      id: 'banner-ad',
      path: '/6355419/Travel/Europe/France/Paris',
      sizes: [[300, 250]],
    },
  ],
  usePrebid: false,
  useAPS: false,
  customEvents: {
    blueBackground: {
      eventMessagePrefix: 'BlueBackground:',
    },
  },
}
```

2. In places you want to show advertising, wrap the area with `AdvertisingProvider` and provide the config from the previous step, so information in your config is passed to the ad slot.

```
<template>
  <AdvertisingProvider :config="gptConfig">
			...
  </AdvertisingProvider>
</template>
```

3. Use `AdvertisingSlot` to display ads in the location where you want to show ads, and note that `AdvertisingSlot` must be used within `AdvertisingProvider`
    
    ```vue
    <AdvertisingSlot id="banner-ad" :is-sticky="true" />
    ```
    
4.  Your ads will now appear!

### Preload ads (optional)

**vue-advertising only**

Replacing `AdvertisingProvider` with `GlobalAdvertisingProvider` and `AdvertisingSlot` with `GlobalAdvertisingSlot` can speed up the loading of ads.

## Credits

- @KijijiCA - original [react-advertising](https://github.com/KijijiCA/react-advertising)
- @ches4117 - rewrite react-advertising to vue-advertising

![vue-advertising](https://user-images.githubusercontent.com/53453555/224674120-fe61a13e-3442-408e-896d-00168d6d0ed2.png)

<div align="center"><strong>Vue Advertising</strong></div>
<div align="center">A JavaScript library for display ads in [Vue](https://vuejs.org) applications.</div>
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

One central configuration file for all your Google Publisher Tags and Prebid placements (Prebid is optional). One provider component that handles all the “plumbing” with googletag and pbjs, nicely hidden away. Ad slot components that get filled with creatives from the ad server when they mount to the DOM. Works well in single page applications with multiple routes. Suitable for server-side-rendering. Supports lazy loading, even for Prebid ads, individually configurable per ad slot

## Why

We believe publishing is core to any modern society. However, it is getting more and more difficult to monetise content with advertising, and use modern development tools. Advertising needs a revmp. A renovation. Modernised for the way we create content today.

- One central configuration file for all your Google Publisher Tags and Prebid placements (Prebid is optional)
- One provider component that handles all the “plumbing” with googletag and pbjs, nicely hidden away
- Ad slot components that get filled with creatives from the ad server when they mount to the DOM
- Works well in single page applications with multiple routes
- Suitable for server-side-rendering
- Supports lazy loading, even for Prebid ads, individually configurable per ad slot

## Prerequisites

To use it, you need to have a Google Ad Manager account set up to deliver display ads through Google Publisher Tags (GPT).

Optionally, vue-advertising supports use of real-time header bidding with Prebid.

## Usage

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

2. In places you want to show advertising, wrap the area with `AdvertisingProvider` so information in your config file is passed to the ad slot.

```
<template>
  <AdvertisingProvider :config="gptConfig">
			...
  </AdvertisingProvider>
</template>
```

3.  Place the `AdvertisingSlot` in the position you want to insert an ad inside `AdvertisingProvider`

    ```html
    <AdvertisingSlot id="banner-ad" :is-sticky="true" />
    ```

4.  Your ads will now appear!

### Preload ads (optional)

Using `GlobalAdvertisingProvider` and `GlobalAdvertisingSlot`, ads can be preloaded to ensure maximum viewability (you will need to use `@vueuse/head` or `@unhead/vue` to preload the script)

## Credits

- @KijijiCA - original [react-advertising](https://github.com/KijijiCA/react-advertising)
- @ches4117 - rewrite react-advertising to vue-advertising

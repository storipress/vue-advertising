# vue-advertising

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
    
4. Your ads will now appear!


### Preload ads (optional)

Using `GlobalAdvertisingProvider` and `GlobalAdvertisingSlot`, ads can be preloaded to ensure maximum viewability (you will need to use `@vueuse/head` or `@unhead/vue` to preload the script)

## Credits

- @KijijiCA - original [react-advertising](https://github.com/KijijiCA/react-advertising)
- @ches4117 - rewrite react-advertising to vue-advertising

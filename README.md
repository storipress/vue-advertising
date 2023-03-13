# vue-advertising

## Usage

### How to set advertising

1. Create a `GPT` config 

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

2. Wrap the entire area that you want to display ad with `AdvertisingProvider` to provide the config

```
<template>
  <AdvertisingProvider :config="gptConfig">
			...
  </AdvertisingProvider>
</template>
```

3.  Place `AdvertisingSlot` to the position that you want to insert ad inside `AdvertisingProvider`
    
    ```html
    <AdvertisingSlot id="banner-ad" :is-sticky="true" />
    ```
    
4. You will see advertise appear


### Preload the advertising

Use `GlobalAdvertisingProvider` and `GlobalAdvertisingSlot`, ads can be loaded as fast as possible (need to use `@vueuse/head` or `@unhead/vue` to preload the script)

## Credits

- @KijijiCA - original [react-advertising](https://github.com/KijijiCA/react-advertising)
- @ches4117 - rewrite react-advertising to vue-advertising

import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

const AD_COMPONENTS = ['AdvertisingProvider', 'AdvertisingSlot', 'GlobalAdvertisingProvider', 'GlobalAdvertisingSlot']

export default defineNuxtModule({
  meta: {
    name: '@storipress/vue-advertising',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  async setup() {
    const resolver = createResolver(import.meta.url)

    for (const component of AD_COMPONENTS) {
      await addComponent({
        name: component,
        export: component,
        filePath: resolver.resolve('./components/index.ts'),
      })
    }
  },
})

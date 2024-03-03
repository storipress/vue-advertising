import { createInjectionState } from '@vueuse/core'
import type { Ref } from 'vue'
import type { TAdvertisingConfig } from './components/utils/AdvertisingConfig'
import type Advertising from './Advertising'
import { ref } from 'vue'

interface TAdvertisingContext {
  activate: Ref<((id: string, customEventHandlers: Record<string, () => void>) => Advertising | void) | undefined>
  config: Ref<TAdvertisingConfig | null>
}

const [useProvideAdvertisingContext, useAdvertisingContext] = createInjectionState(
  ({ activate, config }: TAdvertisingContext) => {
    return {
      activate,
      config,
    }
  },
)

export function useAdvertisingContextWithDefault() {
  return (
    useAdvertisingContext() ?? {
      activate: ref(() => undefined),
      config: ref(null),
    }
  )
}
export { useProvideAdvertisingContext, useAdvertisingContext }

import { TAdvertisingConfig } from "./AdvertisingConfig";

export default function getLazyLoadConfig(
  config: TAdvertisingConfig,
  id: string
) {
  if (!config?.slots) {
    return null;
  }
  const slotConfig = config.slots.find((slot) => slot.id === id);
  if (!slotConfig) {
    return null;
  }
  if (
    typeof slotConfig.enableLazyLoad !== "undefined" &&
    slotConfig.enableLazyLoad !== null
  ) {
    return slotConfig.enableLazyLoad;
  }
  return config?.enableLazyLoad === undefined ? null : config?.enableLazyLoad;
}

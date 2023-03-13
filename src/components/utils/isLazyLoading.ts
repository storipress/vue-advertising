import { TAdvertisingConfig } from "./AdvertisingConfig";

export default function isLazyLoading(
  lazyLoadConfig: TAdvertisingConfig["enableLazyLoad"] | boolean
) {
  if (typeof lazyLoadConfig === "boolean") {
    return lazyLoadConfig;
  }

  if (!lazyLoadConfig) {
    return false;
  }

  const { marginPercent } = lazyLoadConfig;

  if (!marginPercent) {
    return true;
  }

  return marginPercent > -1;
}

import type { TAdvertisingSlotConfig } from "./AdvertisingSlotConfig";

export interface TAdvertisingConfig {
  path?: string;
  targeting?: object;
  usePrebid?: boolean;
  prebid?: {
    debug?: boolean;
    bidderTimeout?: number;
    enableSendAllBids?: boolean;
    bidderSequence?: "rand: TAdvertisingConfigom" | "fixed";
    publisherDomain?: string;
    cookieSyncDelay?: number;
    priceGranularity?:
      | "low"
      | "medium"
      | "high"
      | "auto"
      | "dense"
      | {
          buckets: {
            precision?: number;
            max: number;
            increment: number;
          }[];
        };
    mediaTypePriceGranularity?: {
      video?:
        | "low"
        | "medium"
        | "high"
        | "auto"
        | "dense"
        | {
            buckets: {
              precision?: number;
              max: number;
              increment: number;
            }[];
          };
      banner?:
        | "low"
        | "medium"
        | "high"
        | "auto"
        | "dense"
        | {
            buckets: {
              precision?: number;
              max: number;
              increment: number;
            }[];
          };
      native?:
        | "low"
        | "medium"
        | "high"
        | "auto"
        | "dense"
        | {
            buckets: {
              precision?: number;
              max: number;
              increment: number;
            }[];
          };
    };
    sizeConfig?: {
      mediaQuery: string;
      sizesSupported?: string | number[][];
      labels?: string[];
    }[];
  };
  useAPS?: boolean;
  aps?: {
    pubID?: string;
    bidTimeout?: number;
    deals?: boolean;
  };
  sizeMappings?: Record<
    string,
    {
      viewPortSize: number[];
      sizes: string | number[][];
    }[]
  >;
  slots?: TAdvertisingSlotConfig[];
  outOfPageSlots?: {
    id?: string;
  }[];
  interstitialSlot?: {
    path: string;
    targeting?: object;
  };
  customEvents?: Record<
    string,
    {
      eventMessagePrefix: string;
      divIdPrefix?: string;
    }
  >;
  enableLazyLoad?:
    | boolean
    | {
        marginPercent?: number;
        mobileScaling?: number;
      };
}

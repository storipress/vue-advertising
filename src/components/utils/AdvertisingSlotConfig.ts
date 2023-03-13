export interface TAdvertisingSlotConfig {
  id: string;
  path?: string;
  collapseEmptyDiv?: boolean[];
  targeting?: object;
  sizes?: string | string[] | number[] | number[][];
  sizeMappingName?: string;
  prebid?: {
    mediaTypes: Record<
      string,
      {
        sizes?: number[][];
      }
    >;
    bids: {
      bidder: string;
      params?: object;
      labelAny?: string[];
      labelAll?: string[];
    }[];
  }[];
  enableLazyLoad?:
    | boolean
    | {
        marginPercent?: number;
        mobileScaling?: number;
      };
}

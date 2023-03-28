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

const gptConfig2 = {
  slots: [
    {
      id: 'banner-ad',
      path: '/6355419/Travel/Europe/France/Paris',
      sizes: [[728, 90]],
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

const div_1_sizes = [
  [300, 250],
  [300, 600],
]
const div_2_sizes = [
  [728, 90],
  [970, 250],
]

const prebidConfig = {
  slots: [
    {
      id: 'banner-ad',
      path: '/19968336/header-bid-tag-1',
      sizes: div_2_sizes,
      prebid: [
        {
          mediaTypes: {
            banner: {
              sizes: div_2_sizes,
            },
          },
          bids: [
            {
              bidder: 'appnexus',
              params: {
                placementId: 13144370,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'prebid-2',
      path: '/19968336/header-bid-tag-0',
      sizes: div_1_sizes,
      prebid: [
        {
          mediaTypes: {
            banner: {
              sizes: div_1_sizes,
            },
          },
          bids: [
            {
              bidder: 'appnexus',
              params: {
                placementId: 13144370,
              },
            },
          ],
        },
      ],
    },
  ],
  usePrebid: true,
  useAPS: false,
}

const lazyloadConfig = {
  slots: [
    {
      id: 'gpt-ad01',
      path: '/6355419/Travel/Europe/France',
      sizes: [[728, 90]],
    },
    {
      id: 'gpt-ad02',
      path: '/6355419/Travel/Europe/Spain',
      sizes: [[728, 90]],
    },
    {
      id: 'gpt-ad03',
      path: '/6355419/Travel/Europe/Italy',
      sizes: [[728, 90]],
    },
    {
      id: 'gpt-ad04',
      path: '/6355419/Travel/Europe/Portugal',
      sizes: [[728, 90]],
    },
  ],
  enableLazyLoad: true,
  targeting: {
    test: 'lazyload',
  },
}

export { gptConfig, gptConfig2, prebidConfig, lazyloadConfig }

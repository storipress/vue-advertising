export default class Advertising {
  constructor(
    config,
    plugins = [],
    onError = () => {
      // intentionally empty. <default function>
    }
  ) {
    this.config = config
    this.slots = {}
    this.outOfPageSlots = {}
    this.plugins = plugins
    this.onError = onError
    this.gptSizeMappings = {}
    this.customEventCallbacks = {}
    this.customEventHandlers = {}
    this.queue = []
    this.setDefaultConfig()
    this.defaultLazyLoadConfig = {
      marginPercent: 0,
      mobileScaling: 1,
    }
    this.EXECUTE_PLUGINS_ACTION = {
      SETUP: 'setup',
      DISPLAYSLOTS: 'displaySlots',
      DISPLAYOUTOFPAGESLOT: 'displayOutOfPageSlot',
      REFRESHINTERSTITIALSLOT: 'refreshInterstitialSlot',
      SETUPPREBID: 'setupPrebid',
      TEARDOWNPREBID: 'teardownPrebid',
      SETUPGPT: 'setupGpt',
      TEARDOWNGPT: 'teardownGpt',
    }

    this.requestManager = {
      aps: false,
      prebid: false,
    }
  }

  // ---------- PUBLIC METHODS ----------

  async setup() {
    this.isPrebidUsed =
      typeof this.config.usePrebid === 'undefined' ? typeof window.pbjs !== 'undefined' : this.config.usePrebid
    this.isAPSUsed =
      typeof this.config.useAPS === 'undefined' ? typeof window.apstag !== 'undefined' : this.config.useAPS
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.SETUP)
    const { queue, isPrebidUsed, isAPSUsed } = this
    this.setupCustomEvents()
    const setUpQueueItems = [Advertising.queueForGPT(this.setupGpt.bind(this), this.onError)]
    if (isAPSUsed) {
      this.initApstag()
    }
    if (isPrebidUsed) {
      setUpQueueItems.push(Advertising.queueForPrebid(this.setupPrebid.bind(this), this.onError))
    }

    await Promise.all(setUpQueueItems)
    if (queue.length === 0) {
      return
    }
    this.setCustomEventCallbackByQueue(queue)
    const { divIds, selectedSlots } = this.getDivIdsAndSlots()

    if (isPrebidUsed) {
      Advertising.queueForPrebid(this.getPrebidFetchBidsCallback(divIds, selectedSlots), this.onError)
    }

    if (this.isAPSUsed) {
      this.apstagFetchBids(selectedSlots, selectedSlots)
    }

    if (!isPrebidUsed && !isAPSUsed) {
      Advertising.queueForGPT(() => window.googletag.pubads().refresh(selectedSlots), this.onError)
    }
  }

  async teardown() {
    this.teardownCustomEvents()
    const teardownQueueItems = [Advertising.queueForGPT(this.teardownGpt.bind(this), this.onError)]
    if (this.isPrebidUsed) {
      teardownQueueItems.push(Advertising.queueForPrebid(this.teardownPrebid.bind(this), this.onError))
    }
    await Promise.all(teardownQueueItems)
    this.slots = {}
    this.gptSizeMappings = {}
    this.queue = []
  }

  activate(id, customEventHandlers = {}) {
    const { slots, isPrebidUsed } = this
    // check if have slots from configurations
    if (Object.values(slots).length === 0 && id) {
      this.queue.push({ id, customEventHandlers })
      return
    }
    this.setCustomEventCallback(id, customEventHandlers)

    if (isPrebidUsed) {
      Advertising.queueForPrebid(this.getPrebidFetchBidsCallback([id], [slots[id].gpt]), this.onError)
    }

    if (this.isAPSUsed) {
      this.apstagFetchBids([slots[id]], [slots[id].gpt])
    }

    if (!this.isPrebidUsed && !this.isAPSUsed) {
      Advertising.queueForGPT(() => window.googletag.pubads().refresh([slots[id].gpt]), this.onError)
    }
  }

  isConfigReady() {
    return Boolean(this.config)
  }

  setConfig(config) {
    this.config = config
    this.setDefaultConfig()
  }

  // ---------- PRIVATE METHODS ----------
  apstagFetchBids(selectedSlots, checkedSlots) {
    try {
      window.apstag.fetchBids(
        {
          slots: selectedSlots.map((slot) => slot.aps),
        },
        () => {
          Advertising.queueForGPT(() => {
            window.apstag.setDisplayBids()
            this.requestManager.aps = true // signals that APS request has completed
            this.refreshSlots(checkedSlots) // checks whether both APS and Prebid have returned
          }, this.onError)
        }
      )
    } catch (error) {
      this.onError(error)
    }
  }

  getPrebidFetchBidsCallback(divIds, selectedSlots) {
    return () =>
      window.pbjs.requestBids({
        adUnitCodes: divIds,
        bidsBackHandler: () => {
          window.pbjs.setTargetingForGPTAsync(divIds)
          this.requestManager.prebid = true
          this.refreshSlots(selectedSlots)
        },
      })
  }

  getDivIdsAndSlots() {
    const { queue, outOfPageSlots, slots } = this
    const divIds = []
    const selectedSlots = []
    queue.forEach((item) => {
      const { id } = item
      if (id) {
        divIds.push(item)
      }
      selectedSlots.push(slots[id]?.gpt || outOfPageSlots[id])
    })
    return { divIds, selectedSlots }
  }

  setCustomEventCallbackByQueue(queue) {
    for (let i = 0; i < queue.length; i++) {
      const { id, customEventHandlers } = queue[i]
      this.setCustomEventCallback(id, customEventHandlers)
    }
  }

  setCustomEventCallback(id, customEventHandlers) {
    Object.keys(customEventHandlers).forEach((customEventId) => {
      if (!this.customEventCallbacks[customEventId]) {
        this.customEventCallbacks[customEventId] = {}
      }
      this.customEventCallbacks[customEventId][id] = customEventHandlers[customEventId]
    })
  }

  initApstag() {
    try {
      window.apstag.init({
        ...this.config.aps,
        adServer: 'googletag',
      })
    } catch (error) {
      this.onError(error)
    }
  }

  setupCustomEvents() {
    if (!this.config.customEvents) {
      return
    }
    Object.keys(this.config.customEvents).forEach((customEventId) =>
      this.setupCustomEvent(customEventId, this.config.customEvents[customEventId])
    )
  }

  setupCustomEvent(customEventId, { eventMessagePrefix, divIdPrefix }) {
    const { customEventCallbacks } = this
    this.customEventHandlers[customEventId] = ({ data }) => {
      if (typeof data !== 'string' || !data.startsWith(`${eventMessagePrefix}`)) {
        return
      }
      const divId = `${divIdPrefix || ''}${data.substr(eventMessagePrefix.length)}`
      const callbacks = customEventCallbacks[customEventId]
      if (!callbacks) {
        return
      }
      const callback = callbacks[divId]
      if (callback) {
        callback()
      }
    }
    window.addEventListener('message', this.customEventHandlers[customEventId])
  }

  teardownCustomEvents() {
    if (!this.config.customEvents) {
      return
    }
    Object.keys(this.config.customEvents).forEach((customEventId) =>
      window.removeEventListener('message', this.customEventHandlers[customEventId])
    )
  }

  defineGptSizeMappings() {
    if (!this.config.sizeMappings) {
      return
    }
    const entries = Object.entries(this.config.sizeMappings)
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i]
      const sizeMapping = window.googletag.sizeMapping()
      for (let q = 0; q < value.length; q++) {
        const { viewPortSize, sizes } = value[q]
        sizeMapping.addSize(viewPortSize, sizes)
      }
      this.gptSizeMappings[key] = sizeMapping.build()
    }
  }

  getGptSizeMapping(sizeMappingName) {
    return sizeMappingName && this.gptSizeMappings[sizeMappingName] ? this.gptSizeMappings[sizeMappingName] : null
  }

  defineSlots() {
    if (!this.config.slots) {
      return
    }
    this.config.slots.forEach(({ id, path, collapseEmptyDiv, targeting = {}, sizes, sizeMappingName }) => {
      const gptSlot = window.googletag.defineSlot(path || this.config.path, sizes, id)

      const sizeMapping = this.getGptSizeMapping(sizeMappingName)
      if (sizeMapping) {
        gptSlot.defineSizeMapping(sizeMapping)
      }

      if (collapseEmptyDiv && collapseEmptyDiv.length && collapseEmptyDiv.length > 0) {
        gptSlot.setCollapseEmptyDiv(...collapseEmptyDiv)
      }

      const entries = Object.entries(targeting)
      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i]
        gptSlot.setTargeting(key, value)
      }

      gptSlot.addService(window.googletag.pubads())

      const apsSlot = {
        slotID: id,
        slotName: path,
        sizes: sizes.filter(
          // APS requires sizes to have type number[][]. Each entry in sizes
          // should be an array containing height and width.
          (size) => typeof size === 'object' && typeof size[0] === 'number' && typeof size[1] === 'number'
        ),
      }

      this.slots[id] = { gpt: gptSlot, aps: apsSlot }
    })
  }

  defineOutOfPageSlots() {
    if (this.config.outOfPageSlots) {
      this.config.outOfPageSlots.forEach(({ id, path }) => {
        const slot = window.googletag.defineOutOfPageSlot(path || this.config.path, id)
        slot.addService(window.googletag.pubads())
        this.outOfPageSlots[id] = slot
      })
    }
  }

  defineInterstitialSlot() {
    if (this.config.interstitialSlot) {
      const { path, targeting } = this.config.interstitialSlot
      const slot = window.googletag.defineOutOfPageSlot(
        path || this.config.path,
        window.googletag.enums.OutOfPageFormat.INTERSTITIAL
      )
      if (slot) {
        const entries = Object.entries(targeting || [])
        for (let i = 0; i < entries.length; i++) {
          const [key, value] = entries[i]
          slot.setTargeting(key, value)
        }
        slot.addService(window.googletag.pubads())
        this.interstitialSlot = slot
      }
    }
  }

  displaySlots() {
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.DISPLAYSLOTS)
    this.config.slots.forEach(({ id }) => {
      window.googletag.display(id)
    })
  }

  displayOutOfPageSlots() {
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.DISPLAYOUTOFPAGESLOT)
    if (this.config.outOfPageSlots) {
      this.config.outOfPageSlots.forEach(({ id }) => {
        window.googletag.display(id)
      })
    }
  }

  refreshInterstitialSlot() {
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.REFRESHINTERSTITIALSLOT)
    if (this.interstitialSlot) {
      window.googletag.pubads().refresh([this.interstitialSlot])
    }
  }

  getAdUnits() {
    return this.config.slots.reduce(
      (acc, currSlot) =>
        acc.concat(
          currSlot.prebid.map((currPrebid) => ({
            code: currSlot.id,
            mediaTypes: currPrebid.mediaTypes,
            bids: currPrebid.bids,
          }))
        ),
      []
    )
  }

  setupPrebid() {
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.SETUPPREBID)
    const adUnits = this.getAdUnits()
    window.pbjs.addAdUnits(adUnits)
    window.pbjs.setConfig(this.config.prebid)
  }

  teardownPrebid() {
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.TEARDOWNPREBID)
    this.getAdUnits().forEach(({ code }) => window.pbjs.removeAdUnit(code))
  }

  setupGpt() {
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.SETUPGPT)
    const pubads = window.googletag.pubads()
    const { targeting } = this.config
    this.defineGptSizeMappings()
    this.defineSlots()
    this.defineOutOfPageSlots()
    this.defineInterstitialSlot()
    const entries = Object.entries(targeting)
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i]
      pubads.setTargeting(key, value)
    }
    pubads.disableInitialLoad()
    pubads.enableSingleRequest()

    window.googletag.enableServices()
    this.displaySlots()
    this.displayOutOfPageSlots()
    this.refreshInterstitialSlot()
  }

  teardownGpt() {
    this.executePlugins(this.EXECUTE_PLUGINS_ACTION.TEARDOWNGPT)
    window.googletag.destroySlots()
  }

  setDefaultConfig() {
    if (!this.config) {
      return
    }
    if (!this.config.prebid) {
      this.config.prebid = {}
    }
    if (!this.config.metaData) {
      this.config.metaData = {}
    }
    if (!this.config.targeting) {
      this.config.targeting = {}
    }
    if (this.config.enableLazyLoad === true) {
      this.config.enableLazyLoad = this.defaultLazyLoadConfig
    }
    if (this.config.slots) {
      this.config.slots = this.config.slots.map((slot) =>
        slot.enableLazyLoad === true ? { ...slot, enableLazyLoad: this.defaultLazyLoadConfig } : slot
      )
    }
  }

  executePlugins(method) {
    for (let i = 0; i < this.plugins.length; i++) {
      const func = this.plugins[i][method]
      if (func) {
        func.call(this)
      }
    }
  }

  // when both APS and Prebid have returned, initiate ad request
  refreshSlots(selectedSlots) {
    // If using APS, we need to check that we got a bid from APS.
    // If using Prebid, we need to check that we got a bid from Prebid.
    if (this.isAPSUsed !== this.requestManager.aps || this.isPrebidUsed !== this.requestManager.prebid) {
      return
    }

    Advertising.queueForGPT(() => {
      window.googletag.pubads().refresh(selectedSlots)
    }, this.onError)

    this.requestManager.aps = false
    this.requestManager.prebid = false
  }

  static queueForGPT(func, onError) {
    return Advertising.withQueue(window.googletag.cmd, func, onError)
  }

  static queueForPrebid(func, onError) {
    return Advertising.withQueue(window.pbjs.que, func, onError)
  }

  static withQueue(queue, func, onError) {
    return new Promise((resolve) =>
      queue.push(() => {
        try {
          func()
          resolve()
        } catch (error) {
          onError(error)
        }
      })
    )
  }
}

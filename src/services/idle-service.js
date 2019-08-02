//manages when user has gone idle

let _timeoutId
let _idleCallback = null
let _notIdleEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
let _FIVE_MINUTES_IN_MS = 5 * 60 * 1000

const IdleService = {
  setIdleCallback(idleCallback){
    //store cb to call when user goes idle
    _idleCallback = idleCallback
  },
  //called when user interacts with page
  resetIdleTimer(ev){
    console.info('event:', ev.type)
    //remove timeouts because user interacted
    clearTimeout(_timeoutId)
    //queue callback to happen 5 min from now
    _timeoutId = setTimeout(_idleCallback, _FIVE_MINUTES_IN_MS)
  },
  registerIdleTimerResets(){
    //register resetidleTimer for events when user interacts
    _notIdleEvents.forEach(event =>
      document.addEventListener(event, IdleService.resetIdleTimer, true))
  },
  unRegisterIdleResets(){
    //remove queued callbacks and events that will queue callbacks
    clearTimeout(_timeoutId)
    _notIdleEvents.forEach(event =>
      document.removeEventListener(event, IdleService.resetIdleTimer, true))
  }
}

export default IdleService
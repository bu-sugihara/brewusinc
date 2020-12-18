/**
 * クリックイベント
 * dispatcher
 */

class EventDispatcher {
  constructor() {
    this.events = []
  }

  add(eventName, callback) {
    this.events[ eventName ] = callback

    return this
  }

  dispatch(eventName) {
    if (this.events[ eventName ]) return

    this.events[ eventName ]()
  }

  on(target, callback) {
    const elm = document.getElementById(target) || document.getElementsByClassName(target)

    if (elm.length) {
      for(let dom of elm) {
        dom.onclick = (e) => callback(e, dom)
      }
    } else {
      elm.onclick = (e) => callback(e, elm)
    }
  }

  remove() {
    this.events = []
  }
}

export default new EventDispatcher()

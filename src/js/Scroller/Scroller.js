import Easing from './Easing'

class Scroller {
  constructor(props = {}) {
    this.body = this.getElm()
    this.elapsedTime = 0       // elapsed time
    this.timer       = null
    this.option = {
      easing  : props.easing   || 'easeOutQuint', // default easing
      duration: props.duration || 600,            // default all time
      frame   : props.frame    || 15,             // default one frame time
      revise  : props.revise   || 0,              // default revise pixel
    }
  }

  getElm() {
    if ('scrollingElement' in document) {
      return document.scrollingElement
    }
    if (navigator.userAgent.indexOf('WebKit') != -1) {
      return document.body
    }
    return document.documentElement
  }

  /**
   * scrollReset
   */
  reset() {
    clearTimeout(this.timer)
    this.body.scrollTop = 0
  }

  /**
   * toTop
   * @param  {Object} option easing, duration, frame is setting
   * @return {void}
   */
  toTop(option = {}) {
    if(this.elapsedTime > 0) return
    const sX = this.body.scrollTop, eX = option.revise || this.option.revise
    this.to(sX, eX, option)
  }

  /**
   * toTarget
   * @param  {String} target id name or class name
   * @param  {Object} option easing, duration, frame, revise is setting
   * @return {void}
   */
  toTarget(target, option = {}, callback) {
    if (this.elapsedTime > 0) return
    // const elm = document.getElementsByClassName(className)
    let elm = document.getElementById(target) || document.getElementsByClassName(target)
    if (!elm) return

    if (elm.length) {
      elm = elm[0]
    }

    if (!elm.getBoundingClientRect) return

    const revise = option.revise || this.option.revise
    const sX = this.body.scrollTop
    const eX = sX + elm.getBoundingClientRect().top + revise
    this.to(sX, eX, option, callback)
  }

  getTargetTop(target, option = {}) {
    let elm = document.getElementById(target) || document.getElementsByClassName(target)
    if (!elm || !elm.length) return 0

    if (elm.length) {
      elm = elm[0]
    }

    const sX = this.body.scrollTop
    const revise = option.revise || this.option.revise

    return sX + elm.getBoundingClientRect().top + revise
  }

  /**
   * scroller
   * @param  {Number} sX     start x px
   * @param  {Number} eX     end x px
   * @param  {Object} option
   * @return {void}
   */
  to(sX, eX, option = {}, callback = null) {
    if (this.timer) clearTimeout(this.timer)
    const easing   = option.easing || this.option.easing
    const duration = option.duration || this.option.duration
    const frame    = option.frame || this.option.frame

    if(this.elapsedTime >= duration) {
      this.body.scrollTop = eX
      this.elapsedTime = 0

      if (callback && typeof callback === 'function') {
        callback()
      }
    } else {
      const ease = Easing[easing] || Easing[this.option.easing]
      this.body.scrollTop = ease(this.elapsedTime, sX, eX - sX, duration)

      this.elapsedTime += frame

      this.timer = setTimeout(() => {
        this.to(sX, eX, option)
      }, frame)
    }
  }

  getCurrentTop() {
    return this.body.scrollTop
  }

  kill() {
    clearTimeout(this.timer)
    this.elapsedTime = 0
  }

  // getTargetTop(className) {
  //   const elm = document.getElementsByClassName(className)
  //   const sX = this.body.scrollTop
  //   const eX = elm[0] ? sX + elm[0].getBoundingClientRect().top : 0
  //   return eX
  // }
}

export default Scroller

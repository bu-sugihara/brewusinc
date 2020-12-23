import gsap, { Power2, Linear } from 'gsap'
// js
import scroller from 'js/Scroller'
import EventDispatcher from 'js/EventDispatcher'
// const
import Const from 'src/const'

export const headerInAnime = gsap.to('.gHeader', { top: 0 })
headerInAnime.pause()

export const headerOutAnime = gsap.to('.gHeader', { top: `-187px` })
headerOutAnime.pause()

const setSpHeaderAnimation = () => {
  const tl = gsap.timeline()

  tl.to('.content__bg', { 'backgroundPositionX': `-100vw`, duration: 10, ease: Linear.easeNone, repeat: -1 })

  // スクロール監視
  // 指定の位置で背景アニメーションの停止
  window.addEventListener('scroll', (e) => {
    const wh = window.innerHeight || document.documentElement.clientHeight || 0
    const st = window.scrollY || window.pageYOffset
    const isActive = tl.isActive()

    if (isActive && wh < st) {
      tl.pause()
    } else if (!isActive && wh > st) {
      tl.play()
    } else {
    }
  })
}

export const init = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIe = userAgent.indexOf('msie') != -1

  if (isIe) {
    document.body.classList.toggle('ie')
  }

  if (!Const.IS_SP && !isIe) setSpHeaderAnimation()
  // Scroller定義
  const Scroller = new scroller({ revise: -75 })

  const headerNavItems = document.getElementsByClassName('nav--header')[0]

  const hash = location.hash ? location.hash.replace('#', '') : false

  if (hash) {
    Scroller.to(0, Scroller.getTargetTop(`${ hash }`))
  }

  // gaイベント
  EventDispatcher.on('gaEvent', (e, dom) => {
    const categoryName = dom.getAttribute('data-category-name') ? dom.getAttribute('data-category-name') : Const.IS_SP ? 'click_sp' : 'click_pc'
    const actionName = dom.getAttribute('data-action-name')
    const pageTitle = dom.getAttribute('data-page-title')
    // TODO: ログ設定条件がクソなので無理やり
    const labelName = dom.getAttribute('data-label-name') === 'navi' && !Const.IS_SP
      ? `/${ pageTitle }/header_navi`
      : dom.getAttribute('data-label-name') === 'navi' && Const.IS_SP
      ? `/${ pageTitle }/toggle_list`
      : `/${ pageTitle }/${ dom.getAttribute('data-label-name') }`

    // console.log('ga', categoryName, actionName, labelName);

    gtag('event', actionName, { event_category : categoryName, event_label: labelName, value: '1' });
    // if (ga && categoryName && actionName && labelName) {
      // ga(
      //   'send',
      //   'event',
      //   categoryName,
      //   actionName,
      //   labelName
      // )
    // }
  })

  // ナビ指定位置スクロール
  EventDispatcher.on('nav__item', (e, dom) => {
    const target = dom.getAttribute('data-target-id')

    if (!target) return

    Scroller.toTarget(target)

    if (Const.IS_SP) {
      gsap.set('.gHeader__nav', { left: '100%' })
    // } else {
    //   for (let elm of headerNavItems) {
    //   }
    }
  })

  // ページトップ
  EventDispatcher.on('pTop', (e) => {
    Scroller.toTop()
  })

  // const
  const spNavInAnime = gsap.timeline()
  spNavInAnime
    .to('.gHeader__nav', { left: 0 })
    .add('scene1')
    .to('.nav--header', 0.4, { opacity: 1, top: 0, left: 0, duration: 10 }, 'scene1')

  spNavInAnime.pause()

  EventDispatcher.on('gHeader__icon--hamb', () => {
    spNavInAnime.restart()
  })

  EventDispatcher.on('gHeader__icon--close', () => {
    gsap.set('.gHeader__nav', { left: '100%' })
  })

  const feedInTopClassNames = document.getElementsByClassName('feedInTop')
  const feedInLeftClassNames = document.getElementsByClassName('feedInLeft')
  const animes = []

  for (var dom of feedInTopClassNames) {
    animes.push({
      playPointClassName: dom.getAttribute('data-in-point'),
      tween: gsap.to(dom, { top: 0, opacity: 1 }).pause()
    })
  }

  for (var dom of feedInLeftClassNames) {
    const tl = gsap.timeline().pause()
    tl.to(dom, { left: 0, opacity: 1 })
    if (dom.getAttribute('data-feedIn-classname')) {
      tl.to(`.${ dom.getAttribute('data-feedIn-classname') }`, { opacity: 1, display: 'block' })
    }
    animes.push({
      playPointClassName: dom.getAttribute('data-in-point'),
      tween: tl
    })
  }

  const pTop = document.getElementsByClassName('pTop')[0]

  let isHeaderOut = false
  // const PAGETOP_HEIGHT = Const.IS_SP ? 50 : 75
  const PAGETOP_HEIGHT = 75

  window.addEventListener('scroll', (e) => {
    // footerサイズ
    const FOOTER_HEIGHT = Const.IS_SP ? 632 : 190
    // window幅
    const wh = window.innerHeight || document.documentElement.clientHeight || 0
    // body幅
    const bh = document.body.clientHeight
    // スクロール位置
    const st = window.scrollY || window.pageYOffset

    if (!Const.IS_SP) {
      const revise = wh / 2 * -1

      for (var d of animes) {
        if (Scroller.getTargetTop(d.playPointClassName, { revise }) < st) {
          d.tween.play()
        }
      }
    }

    const b = bh - wh - st

    if (b <= FOOTER_HEIGHT) {
      const bottom = FOOTER_HEIGHT -  b
      pTop.style.bottom = `${ bottom }px`

      if (!isHeaderOut) {
        headerOutAnime.restart()
        isHeaderOut = true
      }
    } else if (st < PAGETOP_HEIGHT) {
      pTop.style.bottom = `-${ PAGETOP_HEIGHT - st }px`
    } else {
      pTop.style.bottom = `${ 0 }px`

      if (isHeaderOut) {
        headerInAnime.restart()
        isHeaderOut = false
      }
    }
  })

  if (Const.IS_SP) {
    // スマホのメニューの日本語は取る
    let navItems = document.getElementsByClassName('nav__item')
    for (var i = 0; i < navItems.length; i++) {
      let val = navItems[i].getElementsByTagName('i')[0]
      if (typeof val !== 'undefined') {
        val.remove()
      }
    }
  }
}

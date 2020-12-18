import './index.scss'

import gsap, { Power2, Linear } from 'gsap'
// js
import scroller from 'js/Scroller'
import EventDispatcher from 'js/EventDispatcher'
import { init as commonInit } from 'js/common'
// const
import Const from 'src/const'

function init() {
  commonInit()

  const Scroller = new scroller({ revise: -60 })
  // intro内scrollボタン
  EventDispatcher.on('philosophy__head__scroll', (e, dom) => {
    const target = dom.getAttribute('data-target-id')
    Scroller.toTarget(target)
  })

  // work内view moreボタン
  EventDispatcher.on('work__content__ex__btn', (e) => {
    e.stopPropagation()

    const elm = document.getElementsByClassName('work')[0]

    if (elm.classList.contains('showAll')) {
      e.target.innerHTML = '<span>View More</span>'
    } else {
      e.target.innerHTML = '<span>Close</span>'
    }

    elm.classList.toggle('showAll')

    // ga
    gtag('event', 'work_viewmore', { event_category : 'click_both_iwv', event_label: 'index/work_vmbutton', value: '1' });
  })

  const elm = document.getElementsByClassName('animation')[0]
  const hash = location.hash ? location.hash.replace('#', '') : false
  const isAnime = elm && !Const.IS_SP && !hash
  const tl = gsap.timeline()

  if (!isAnime) {
    if (elm) elm.classList.remove('animation')
  } else {
    // PC限定
    // window固定
    // document.body.style.position = 'fixed!important'
    document.body.style.cssText += 'position: fixed!important'

    tl.to('.intro__logo', { left: 0, opacity: 1, delay: 1, duration: 0.2, ease: 'none' })
    tl.to('.intro__logo', { opacity: 0, 'webkitFilter': 'blur(5px)', delay: 0.2, duration: 1 })

    tl.add('scene1')

    tl.to('.intro__bg', { opacity: 1, transform: 'scale(1)', duration: 0.2 })

    tl.add('scene2')

    tl.to('.philosophy__head', { display: 'block' }, 'scene2')

    tl.add('scene3')

    tl.to('.gHeader', { top: 0, duration: 0.2 }, 'scene2')

    tl.add('scene4')

    tl.to('.intro__bg', { 'backgroundPositionX': `-100vw`, duration: 10, ease: Linear.easeNone, repeat: -1 })

    tl.add('scene5')

    tl.to('.intro__title__name1', { 'margin-left': '10%', opacity: 1 }, 'scene3')
    tl.to('.intro__title__name2', { 'margin-left': '10%', opacity: 1 })
    tl.to('.intro__title__name3', { 'margin-left': '10%', opacity: 1 })
    tl.to('.intro__title__name4', { 'margin-left': '10%', opacity: 1, onComplete: () => {
      document.body.style.position = 'static'
      elm.classList.remove('animation')
    }})

    // スクロール監視
    // 指定の位置で背景アニメーションの停止
    window.addEventListener('scroll', (e) => {
      if (!isAnime) return
      const wh = window.innerHeight || document.documentElement.clientHeight || 0
      const st = window.scrollY || window.pageYOffset
      const isActive = tl.isActive()

      if (isActive && wh < st) {
        tl.pause()
      } else if (!isActive && wh > st
      ) {
        tl.play()
      } else {
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', init)

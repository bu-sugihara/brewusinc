import './company.scss'
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
  EventDispatcher.on('accessPoint', (e, dom) => {
    Scroller.toTarget('access')
  })
}

document.addEventListener('DOMContentLoaded', init)

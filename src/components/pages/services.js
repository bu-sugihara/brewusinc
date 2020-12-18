import './services.scss'
// js
import scroller from 'js/Scroller'
import EventDispatcher from 'js/EventDispatcher'
import { init as commonInit } from 'js/common'
// const
import Const from 'src/const'

function init() {
  commonInit()
}

document.addEventListener('DOMContentLoaded', init)

/* eslint-disable no-new */
import { createApp } from 'vue'
import 'ant-design-vue/dist/antd.css'
import VueTouch from './plugins/swipe.js'
import './registerServiceWorker.js'
import App from './App.vue'

const app = createApp(App)
app.directive('tap', {
  beforeMount: function (el, binding) {
    new VueTouch(el, binding, 'tap')
  }
})
app.directive('swipe', {
  beforeMount: function (el, binding) {
    new VueTouch(el, binding, 'swipe')
  }
})
app.directive('swipeleft', {
  beforeMount: function (el, binding) {
    new VueTouch(el, binding, 'swipeleft')
  }
})
app.directive('swiperight', {
  beforeMount: function (el, binding) {
    console.log('binded')
    new VueTouch(el, binding, 'swiperight')
  }
})
app.directive('swipedown', {
  beforeMount: function (el, binding) {
    new VueTouch(el, binding, 'swipedown')
  }
})
app.directive('swipeup', {
  beforeMount: function (el, binding) {
    new VueTouch(el, binding, 'swipeup')
  }
})
app.directive('longtap', {
  beforeMount: function (el, binding) {
    new VueTouch(el, binding, 'longtap')
  }
})
app.mount('#app')

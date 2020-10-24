/* eslint-disable no-console */

import { register } from 'register-service-worker'
import n from 'ant-design-vue/es/notification'

// import { registerRoute } from 'workbox-routing'
// import { NetworkFirst } from 'workbox-strategies'

if ('serviceWorker' in window.navigator && process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      // console.log('New content is downloading.')
      n.open({
        message: 'new version found. updating...'
      })
    },
    updated () {
      // console.log('New content is available; please refresh.')
      n.open({
        message: 'update successed, please restart arilychan radio'
      })
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

// registerRoute(
//   ({ url }) => url.pathname.startsWith('/radio'),
//   new NetworkFirst()
// )

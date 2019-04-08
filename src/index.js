import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './bootstrap/configure-store'

import App from './bootstrap/app'
import * as serviceWorker from './bootstrap/service-worker'

import './index.css'

const { store } = configureStore()
export default store

const render = Component => {
  ReactDOM.render(
    <Component
      key={process.env.NODE_ENV === 'development' ? Math.random() : undefined}
      store={store}
    />,
    document.getElementById('root')
  )
}
render(App)

if (module.hot) {
  module.hot.accept('./bootstrap/app', () => {
    render(App)
  })
}

serviceWorker.register()

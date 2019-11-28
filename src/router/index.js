import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store } /* { store, ssrContext } */) {
  const router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  router.beforeEach((to, from, next) => {
    if (from.name === 'policy') {
      if (![ 'signin' ].includes(to.name)) {
        store.state.reqPage = to
        window.localStorage.setItem('reqPage', JSON.stringify({ name: to.name, params: to.params }))
      }
    } else {
      if (![ 'signin', 'preferences' ].includes(to.name)) {
        store.state.reqPage = to
        window.localStorage.setItem('reqPage', JSON.stringify({ name: to.name, params: to.params }))
      }
    }

    var replace = null
    if (to.name === 'policy') {
      // pass thru
    } else if (store.state.loading.length) {
      // pass thru
    } else if (!store.getters.isValid) {
      replace = (store.state.reqPage && store.state.reqPage.name === 'policy') ? store.state.reqPage : router.resolve({ name: 'signin' }).route
    } else if (!store.getters.isSignInMethod) {
      replace = { name: 'preferences' }
    } else if ([ 'signin' ].includes(to.name)) {
      replace = store.state.reqPage || router.resolve({ name: 'top' }).route
    } else if ([
      'accounts'
    ].includes(to.name) && (!store.getters.isManager)) {
      replace = router.resolve({ name: 'top' }).route
    } else if ([
      'service',
      'raw'
    ].includes(to.name) && (!store.getters.isAdmin)) {
      replace = router.resolve({ name: 'top' }).route
    }

    // Call next() once exactly.
    if (!replace) {
      next()
    } else if (replace.path === to.path) {
      next()
    } else if (replace.path === from.path) {
      next(false)
    } else {
      next(replace)
    }
  })

  return router
}

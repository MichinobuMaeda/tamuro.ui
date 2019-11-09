
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/loading',
    component: () => import('layouts/MyLayout.vue'),
    children: [ { path: '', component: () => import('pages/Loading.vue') } ]
  },
  {
    path: '/policy',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PrivacyPolicy.vue') }
    ]
  },
  {
    path: '/signin',
    component: () => import('layouts/MyLayout.vue'),
    children: [ { path: '', component: () => import('pages/SignIn.vue') } ]
  },
  {
    path: '/preferences',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Preferences.vue') }
    ]
  },
  {
    path: '/debug',
    component: () => import('layouts/MyLayout.vue'),
    children: [ { path: '', component: () => import('pages/Debug.vue') } ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

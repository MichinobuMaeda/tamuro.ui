export const routes = [
  {
    path: '/',
    name: 'top',
    component: () => import('../pages/Index.vue'),
    meta: { privs: ['user'] }
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../pages/SignIn.vue'),
    meta: { privs: ['guest'] }
  },
  {
    path: '/inv/:invitation',
    name: 'invitation',
    component: () => import('../pages/Invitation.vue'),
    meta: { privs: ['guest', 'invited'] }
  },
  {
    path: '/inv',
    name: 'prevwInvitation',
    component: () => import('../pages/Invitation.vue'),
    meta: { privs: ['manager', 'admin', 'tester'] }
  },
  {
    path: '/policy',
    name: 'policy',
    component: () => import('../pages/Policy.vue'),
    meta: { privs: ['guest', 'user'] }
  },
  {
    path: '/users/:id/:mode?',
    name: 'user',
    component: () => import('../pages/User.vue'),
    meta: { privs: ['user'] }
  },
  {
    path: '/groups/:id/:mode?',
    name: 'group',
    component: () => import('../pages/Group.vue'),
    meta: { privs: ['user'] }
  },
  {
    path: '/preferences',
    name: 'preferences',
    component: () => import('../pages/Preferences.vue'),
    meta: { privs: ['user'] }
  },
  {
    path: '/admin/:target?',
    name: 'admin',
    component: () => import('../pages/Admin.vue'),
    meta: { privs: ['manager', 'admin'] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../components/NotFound.vue'),
    meta: { privs: ['guest', 'user'] }
  }
]

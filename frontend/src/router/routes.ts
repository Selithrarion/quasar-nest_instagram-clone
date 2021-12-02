import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      {
        path: '/auth',
        component: () => import('pages/Auth.vue'),
        meta: { guest: true },
      },
    ],
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', name: 'feed', component: () => import('pages/Index.vue'), meta: { auth: true } },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('layouts/EmptyLayout.vue'),
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
      { path: '/', name: 'feed', component: () => import('pages/Index.vue') },
      {
        path: '/profile/:profileUsername',
        name: 'profile',
        component: () => import('pages/Profile.vue'),
      },
      {
        path: '/post/:postID',
        name: 'post',
        component: () => import('pages/PostDetail.vue'),
      },
      {
        path: '/explore/tags/:tag',
        name: 'tags',
        component: () => import('pages/Explore.vue'),
      },
      {
        path: '/explore/people',
        name: 'people',
        component: () => import('pages/ExplorePeople.vue'),
      },
    ],
  },

  {
    path: '/story',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '/story',
        name: 'storyFeed',
        component: () => import('pages/StoryFeed.vue'),

        children: [
          {
            path: '/story/:storyID',
            name: 'story',
            component: () => import('components/story/StoryItem.vue'),
          },
        ],
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

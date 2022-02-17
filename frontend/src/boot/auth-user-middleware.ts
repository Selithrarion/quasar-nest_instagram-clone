import { boot } from 'quasar/wrappers';
import { http } from 'boot/axios';

export default boot(({ router }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const userToken = http.defaults.headers.common.Authorization as string;

  router.beforeEach((to, from, next) => {
    const matchedRoutes = to.matched;
    const isNeedGuest = matchedRoutes.some((record) => record.meta.guest);

    if (isNeedGuest) {
      if (userToken) next('/');
      next();
    } else if (!userToken) {
      console.log('need auth and no token');
      next('/auth');
    } else next();
  });
});

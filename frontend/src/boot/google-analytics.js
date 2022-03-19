/* eslint-disable */
import ga from '../config/analytics';
import { boot } from 'quasar/wrappers';

export default boot(({ router, store }) => {
  router.afterEach((to, from) => {
    ga.logPage(to.path, to.name, store.state.user.currentUser?.id);
  });
});

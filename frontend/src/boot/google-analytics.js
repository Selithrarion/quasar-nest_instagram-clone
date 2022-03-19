/* eslint-disable */
// analytics for cordova app https://quasar.dev/quasar-cli-webpack/developing-cordova-apps/managing-google-analytics
import ga from '../config/analytics';
import { boot } from 'quasar/wrappers';

export default boot(({ router, store }) => {
  router.afterEach((to, from) => {
    ga.logPage(to.path, to.name, store.state.user.currentUser?.id);
  });
});

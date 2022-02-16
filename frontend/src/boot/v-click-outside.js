import vClickOutside from 'click-outside-vue3';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.use(vClickOutside);
});

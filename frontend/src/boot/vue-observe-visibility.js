/* eslint-disable */
import { boot } from 'quasar/wrappers';
import { ObserveVisibility } from 'vue-observe-visibility';

export default boot(({ app }) => {
  app.directive('observe-visibility', {
    beforeMount: (el, binding, vnode) => {
      vnode.context = binding.instance;
      ObserveVisibility.bind(el, binding, vnode);
    },
    update: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind,
  });
});

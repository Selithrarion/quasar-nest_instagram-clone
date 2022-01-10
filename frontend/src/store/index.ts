import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import { createStore, Store as VuexStore, useStore as vuexUseStore } from 'vuex';

import app from 'src/store/app';
import post from 'src/store/post';
import story from 'src/store/story';
import user from 'src/store/user';

import { AppStateInterface } from 'src/store/app/state';
import { PostStateInterface } from 'src/store/post/state';
import { StoryStateInterface } from 'src/store/story/state';
import { UserStateInterface } from 'src/store/user/state';

export interface StateInterface {
  app: AppStateInterface;
  post: PostStateInterface;
  story: StoryStateInterface;
  user: UserStateInterface;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}
// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key');

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules: {
      app,
      post,
      story,
      user,
    },

    strict: !!process.env.DEBUGGING,
  });

  return Store;
});

export function useStore() {
  return vuexUseStore(storeKey);
}

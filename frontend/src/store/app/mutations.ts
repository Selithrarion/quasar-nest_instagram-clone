import { MutationTree } from 'vuex';
import { AppStateInterface } from './state';

const mutation: MutationTree<AppStateInterface> = {
  SET_LOADING(state: AppStateInterface, value: boolean) {
    state.isLoadingState = value;
  },
};

export default mutation;

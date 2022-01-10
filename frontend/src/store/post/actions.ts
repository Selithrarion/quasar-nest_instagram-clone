import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PostStateInterface } from './state';
import { PostDTO } from 'src/models/feed/post.model';
import { PaginationApiPayload } from 'src/models/common/pagination.model';

import postRepository from 'src/repositories/postRepository';

const actions: ActionTree<PostStateInterface, StateInterface> = {
  async getAll({ commit }, payload: PaginationApiPayload) {
    commit('SET_LOADING', true, { root: true });
    const data = await postRepository.getAll(payload);
    commit('SET_POSTS', data);
    commit('SET_LOADING', false, { root: true });
  },
  async getByID({ commit }, id: number) {
    const data = await postRepository.getByID(id);
    commit('SET_POST_DETAIL', data);
  },
  async update({ commit }, { id, payload }: { id: number; payload: PostDTO }) {
    const data = await postRepository.update(id, payload);
    commit('UPDATE_POST', data);
  },
  async delete({ commit }, id: number) {
    await postRepository.delete(id);
    commit('DELETE_POST', id);
  },
  async toggleLike({ commit, rootState }, id: number) {
    const userID = rootState.user.currentUser?.id
    commit('TOGGLE_LIKE', { id, userID });
    await postRepository.toggleLike(id);
  },
};

export default actions;

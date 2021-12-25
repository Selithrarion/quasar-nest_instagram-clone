import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PostStateInterface } from './state';
import { PostDTO } from 'src/models/post/post.model';

import postRepository from 'src/repositories/postRepository';
import { PaginationApiPayload } from 'src/models/common/pagination.model';

const actions: ActionTree<PostStateInterface, StateInterface> = {
  async getAll({ commit }, payload: PaginationApiPayload) {
    const data = await postRepository.getAll(payload);
    commit('SET_POSTS', data);
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
  async toggleLike({ commit }, id: number) {
    commit('TOGGLE_LIKE', id);
    await postRepository.toggleLike(id);
  },
};

export default actions;

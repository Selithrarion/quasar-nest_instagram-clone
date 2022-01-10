import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { StoryStateInterface } from './state';
import { StoryDTO } from 'src/models/feed/story.model';
import { PaginationApiPayload } from 'src/models/common/pagination.model';

import storyRepository from 'src/repositories/storyRepository';

const actions: ActionTree<StoryStateInterface, StateInterface> = {
  async getAll({ commit }, payload: PaginationApiPayload) {
    commit('SET_LOADING', true, { root: true });
    const data = await storyRepository.getAll(payload);
    commit('SET_STORIES', data);
    commit('SET_LOADING', false, { root: true });
  },
  async getByID({ commit }, id: number) {
    const data = await storyRepository.getByID(id);
    commit('SET_STORY_DETAIL', data);
  },
  async update({ commit }, { id, payload }: { id: number; payload: StoryDTO }) {
    const data = await storyRepository.update(id, payload);
    commit('UPDATE_STORY', data);
  },
  async delete({ commit }, id: number) {
    await storyRepository.delete(id);
    commit('DELETE_STORY', id);
  },
};

export default actions;

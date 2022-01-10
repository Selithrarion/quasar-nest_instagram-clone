import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { StoryStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const projectModule: Module<StoryStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default projectModule;

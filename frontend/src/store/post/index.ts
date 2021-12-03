import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { PostStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const projectModule: Module<PostStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default projectModule;

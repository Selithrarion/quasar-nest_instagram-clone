import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { AppStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const projectModule: Module<AppStateInterface, StateInterface> = {
  actions,
  getters,
  mutations,
  state
};

export default projectModule;

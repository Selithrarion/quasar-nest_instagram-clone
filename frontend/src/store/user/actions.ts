import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from 'src/store/user/state';
import {
  UserAuthResponse,
  UserDTO,
  UserLoginDTO,
  UserModel,
  UserRegisterDTO,
  UserSuggestionModel,
  UserUpdateTokenResponse,
} from 'src/models/user/user.model';
import authRepository from 'src/repositories/authRepository';
import userRepository from 'src/repositories/userRepository';
import { Cookies, Notify } from 'quasar';

const actions: ActionTree<UserStateInterface, StateInterface> = {
  async login({ commit }, payload: UserLoginDTO): Promise<UserAuthResponse> {
    const data = await authRepository.login(payload);
    commit('AUTH_USER', data);
    return data;
  },
  async register({ commit }, payload: UserRegisterDTO) {
    const data = await authRepository.register(payload);
    commit('AUTH_USER', data);
  },
  async validate2FA({ commit }, { code, email }: { code: string; email: string }) {
    const data = await authRepository.validate2FaCode(code, email);
    commit('AUTH_USER', data);
    return true;
  },

  logout({ commit }) {
    commit('LOGOUT_USER');
    return;
  },

  async update({ commit }, { id, payload }: { id: number; payload: UserDTO }) {
    const data = await userRepository.update(id, payload);
    commit('UPDATE_USER', data);
  },
  async updateAvatar({ commit }, file) {
    const avatar = await userRepository.uploadAvatar(file);
    Notify.create({
      type: 'positive',
      message: 'Avatar updated',
    });
    commit('UPDATE_USER', { avatar });
    return avatar;
  },

  async authWithGoogle({ commit }, token) {
    const data = await authRepository.authWithGoogle(token);
    commit('AUTH_USER', data);
  },
  async authWithGithub({ commit }, code) {
    const data = await authRepository.authWithGithub(code);
    commit('AUTH_USER', data);
  },

  async loadUser({ commit }, { accessToken, refreshToken }: UserUpdateTokenResponse) {
    const user = await authRepository.getSelf();
    if (user) commit('AUTH_USER', { user, accessToken, refreshToken });
  },
  async updateTokens({ commit }) {
    const { id, email, refreshToken }: UserModel = Cookies.get('user');
    if (!id || !email || !refreshToken) return;

    const payload = {
      userID: id,
      email,
      refreshToken,
    };
    const tokens = await authRepository.updateTokens(payload);
    commit('UPDATE_TOKENS', tokens);

    return tokens;
  },

  async follow({ commit }, id: number) {
    await userRepository.follow(id);
    Notify.create({
      type: 'positive',
      message: 'Successfully followed',
    });
    commit('post/TOGGLE_FOLLOW', id, { root: true });
  },
  async unfollow({ commit }, id: number) {
    await userRepository.unfollow(id);
    Notify.create({
      type: 'positive',
      message: 'Successfully unfollowed',
    });
    commit('post/TOGGLE_FOLLOW', id, { root: true });
  },

  async getSuggestions({ commit }) {
    const data: UserSuggestionModel[] = await userRepository.getSuggestions();
    commit('SET_SUGGESTIONS', data);
  },
};

export default actions;

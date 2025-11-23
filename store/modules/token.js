import {
  loginBySession,
} from '@/api/token';
import cacheStorage from '@/common/cacheStorage';

const initState = () => ({
  token: cacheStorage.get('token'),
});
const state = initState();

export default {
  namespaced: true,
  state,
  mutations: {
    RESET_STATE(state) {
      cacheStorage.remove('token');
      Object.assign(state, initState());
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
      cacheStorage.set('token', token);
    },
    REMOVE_TOKEN: (state) => {
      state.token = null;
      cacheStorage.remove('token');
    },
  },
  actions: {
    LoginBySession({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginBySession(data)
          .then(res => {
            const data = res.data || {};
            let token = data.token;
            if (!token) token = '';
            commit('SET_TOKEN', token);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    RemoveToken({ commit }) {
      commit('REMOVE_TOKEN');
    },
  },
  getters: {
    token: state => state.token
  }
}

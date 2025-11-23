
import {
  code2Session,
} from '@/api/session';
import cacheStorage from '@/common/cacheStorage';

const initState = () => ({
  sessionKey: cacheStorage.get('sessionKey'),
});
const state = initState();

export default {
  namespaced: true,
  state,
  mutations: {
    RESET_STATE(state) {
      cacheStorage.remove('sessionKey');
      Object.assign(state, initState());
    },
    SET_SESSION_KEY: (state, sessionKey) => {
      state.sessionKey = sessionKey;
      cacheStorage.set('sessionKey', sessionKey, 7 * 24 * 60 * 60 * 1000);
    },
    REMOVE_SESSION_KEY: (state) => {
      state.sessionKey = null;
      cacheStorage.remove('sessionKey');
    },
  },
  actions: {
    Code2Session({ commit }, data) {
      return new Promise((resolve, reject) => {
        code2Session(data)
          .then(res => {
            const { sessionKey = '' } = res.data || {};
            commit('SET_SESSION_KEY', sessionKey);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    RemoveSessionKey({ commit }) {
      commit('REMOVE_SESSION_KEY');
    },
  },
  getters: {
    sessionKey: state => state.sessionKey,
  }
}

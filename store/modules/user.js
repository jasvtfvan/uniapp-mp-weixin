import { getUserInfo, logout } from '@/api/user';
import cacheStorage from '@/common/cacheStorage';

function buildUserInfo(source) {
  const srcObj = source || {};
  let ret = {};
  ret.nickName = srcObj.nickName != null ? srcObj.nickName : '';
  ret.gender = srcObj.gender != null ? srcObj.gender : '1';
  return ret;
}

const initState = () => ({
  userInfo: cacheStorage.get('userInfo') || buildUserInfo(null),
  userStatus: null, // 0未注册 1未登录 2已登录
});
const state = initState();

export default {
  namespaced: true,
  state,
  mutations: {
    RESET_STATE(state) {
      cacheStorage.remove('userInfo');
      Object.assign(state, initState());
    },
    SET_USER_INFO: (state, userInfo) => {
      const oTarget = buildUserInfo(userInfo);
      state.userInfo = oTarget;
      cacheStorage.set('userInfo', oTarget);
    },
    REMOVE_USER_INFO: (state) => {
      state.userInfo = buildUserInfo(null);
      cacheStorage.remove('userInfo');
    },
    SET_USER_STATUS: (state, userStatus) => {
      state.userStatus = userStatus;
    },
    REMOVE_USER_STATUS: (state) => {
      state.userStatus = null;
    },
  },
  actions: {
    // 获取用户信息
    GetUserInfo({ commit }, data) {
      return new Promise((resolve, reject) => {
        getUserInfo(data)
          .then(res => {
            const userInfo = res.data || {};
            commit('SET_USER_INFO', userInfo);
            const { userStatus = 0 } = userInfo;
            commit('SET_USER_STATUS', userStatus);
            resolve(userInfo);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 真实接口退出
    Logout({ commit }) {
      return new Promise((resolve) => {
        if (this.getters.token) {
          logout().then(() => {
            this.dispatch('session/RemoveSessionKey');
            this.dispatch('token/RemoveToken');
            commit('REMOVE_USER_INFO');
            commit('REMOVE_USER_STATUS');
            resolve();
          }).catch(() => {
            resolve();
          });
        } else {
          this.dispatch('session/RemoveSessionKey');
          this.dispatch('token/RemoveToken');
          commit('REMOVE_USER_INFO');
          commit('REMOVE_USER_STATUS');
          resolve();
        }
      });
    },
    SetUserStatus({ commit }, data) {
      commit('SET_USER_STATUS', data);
    },
    RemoveUserStatus({ commit }) {
      commit('REMOVE_USER_STATUS');
    },
  },
  getters: {
    userInfo: state => state.userInfo,
    userStatus: state => state.userStatus,
  }
}

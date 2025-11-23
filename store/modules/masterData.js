/**
 * 主数据
 */
import {
  getMasterOuterLink,
} from '@/api/common';
import cacheStorage from '@/common/cacheStorage';

const initState = () => ({
  masterLinkMap: cacheStorage.get('masterLinkMap') || {},
});
const state = initState();

const masterData = {
  namespaced: true,
  state,
  mutations: {
    RESET_STATE(state) {
      cacheStorage.remove('masterLinkMap');
      Object.assign(state, initState());
    },
    SET_MASTER_LINK_MAP: (state, masterLinkMap) => {
      cacheStorage.set('masterLinkMap', masterLinkMap);
      state.masterLinkMap = masterLinkMap || {};
    },
  },

  actions: {
    // 初始化主数据
    InitMasterData({ dispatch }, param = { actions: [], force: false }) {
      const { _actions } = this;
      const actions = param.actions || [];
      const promiseArray = [];
      for (let i = 0; i < actions.length; i++) {
        const mapKey = actions[i];
        if (Object.prototype.hasOwnProperty.call(_actions, `masterData/${mapKey}`)) {
          promiseArray.push(dispatch(mapKey, param.force));
        }
      }
      return Promise.all(promiseArray);
    },
    // 外部链接
    GetMasterOuterLink({ state, commit }, force = false) {
      if (!force && state.masterLinkMap) {
        return new Promise(resolve => {
          resolve(state.masterLinkMap);
        });
      } // 强制或者不存在
      return getMasterOuterLink().then(res => {
        const { data } = res || {};
        commit('SET_MASTER_LINK_MAP', data);
        return data;
      })
    },
  },

  getters: {
    masterLinkMap: state => state.masterLinkMap,
  }
};

export default masterData;

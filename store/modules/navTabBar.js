export default {
  namespaced: true,
  state: {
    tabBarIndex: -1,
    tabBarHeight: 0,
    navHeight: 0,
    paperCount: 0,
  },
  mutations: {
    SET_PAPER_COUNT: (state, count) => {
      state.paperCount = count || 0;
    },
    SET_TAB_BAR_INDEX: (state, index) => {
      state.tabBarIndex = index == null ? -1 : index;
    },
    SET_TAB_BAR_HEIGHT: (state, height) => {
      state.tabBarHeight = height || 0;
    },
    SET_NAV_HEIGHT: (state, height) => {
      state.navHeight = height || 0;
    }
  },
  actions: {
    SetTabBarIndex({ commit }, data) {
      commit('SET_TAB_BAR_INDEX', data);
    },
    SetTabBarHeight({ commit }, data) {
      commit('SET_TAB_BAR_HEIGHT', data);
    },
    SetNavHeight({ commit }, data) {
      commit('SET_NAV_HEIGHT', data);
    },
  },
  getters: {
    tabBarIndex: state => state.tabBarIndex,
    tabBarHeight: state => state.tabBarHeight,
    navHeight: state => state.navHeight,
    paperCount: state => state.paperCount,
  }
}

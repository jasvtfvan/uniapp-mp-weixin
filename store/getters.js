const getters = {
  sessionKey: state => state.session.sessionKey,
  token: state => state.token.token,
  userInfo: state => state.user.userInfo,
  userStatus: state => state.user.userStatus,
  codeKindList: state => state.codeList.codeKindList,
  masterLinkMap: state => state.masterData.masterLinkMap,

  tabBarIndex: state => state.navTabBar.tabBarIndex,
  tabBarHeight: state => state.navTabBar.tabBarHeight,
  navHeight: state => state.navTabBar.navHeight,
};

export default getters;

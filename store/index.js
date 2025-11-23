import Vue from 'vue';
import Vuex from 'vuex';
// import cacheStorage from '@/common/cacheStorage';
import getters from './getters';

/**
 * modules声名begin
 */
import session from './modules/session';
import token from './modules/token';
import user from './modules/user';
import codeList from './modules/codeList';
import masterData from './modules/masterData';
import navTabBar from './modules/navTabBar';
/**
 * modules声名end
 */

/*
// 持久化后，有一个key变成最新，所有key都变成最新，不符合需求
import createPersistedState from 'vuex-persistedstate';
const vuexPersisted = new createPersistedState({
    storage: {
        getItem: key => cacheStorage.get(key),
        setItem: (key, value) => cacheStorage.set(key, value),
        removeItem: key => cacheStorage.remove(key)
    },
    reducer(val) {
        return {
            // 只存储state中的 weChatUser
            weChatUser: val.weChatUser,
            token: val.token,
        }
    }
});
*/

Vue.use(Vuex); // vue的插件机制

// Vuex.Store 构造器选项
const store = new Vuex.Store({
    // 为了不和页面或组件的data中的造成混淆，state中的变量前面建议加上$符号
    modules: {
        // modules声名begin
        session,
        token,
        user,
        codeList,
        masterData,
        navTabBar,
        // modules声名end
    },
    getters,
    actions: {
        // 一键复位所有模块
        resetState({ commit }) {
            commit('session/RESET_STATE', null, { root: true });
            commit('token/RESET_STATE', null, { root: true });
            commit('user/RESET_STATE', null, { root: true });
            commit('codeList/RESET_STATE', null, { root: true });
            commit('masterData/RESET_STATE', null, { root: true })
        }
    },
    // plugins: [vuexPersisted],
    plugins: [],
});

export default store;

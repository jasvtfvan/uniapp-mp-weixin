import App from './App'
import base_url from './common/config.js';

import Vue from 'vue';
import './uni.promisify.adaptor';
import { router } from './router.js';

// vuex
import store from './store';

// 引入全局uView
import uView from "uview-ui";
// 引入全局filters
import filters from './common/filters.js';

// 全局组件begin
import GNav from '@/components/g-nav/index.vue';
import GBackButton from '@/components/g-back-button/index.vue';
import GTabBar from '@/components/g-tab-bar/index.vue';
import GImageIcon from '@/components/g-image-icon/index.vue';
import GContainer from '@/components/g-container/index.vue';
import GButton from '@/components/g-button/index.vue';
// 全局组件end

// 全局方法
import { navigateSmoothTo } from '@/common/util';

Vue.config.productionTip = false;
App.mpType = 'app';

Vue.use(router);
Vue.use(uView);

// 添加全局filter
Object.keys(filters).map(v => {
  Vue.filter(v, filters[v]);
});
// 全局组件begin
Vue.component('g-nav', GNav);
Vue.component('g-back-button', GBackButton);
Vue.component('g-tab-bar', GTabBar);
Vue.component('g-image-icon', GImageIcon);
Vue.component('g-container', GContainer);
Vue.component('g-button', GButton);
// 全局组件end

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);
// #endif

Vue.prototype.$baseUrl = base_url;
Vue.prototype.$navigateSmoothTo = navigateSmoothTo;

const app = new Vue({
  store,
  ...App
});
app.$mount();

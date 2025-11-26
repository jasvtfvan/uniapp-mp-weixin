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
import GNav from '@/components/global-component/g-nav/index.vue';
import GBack from '@/components/global-component/g-back/index.vue';
import GTabBar from '@/components/global-component/g-tab-bar/index.vue';
import GImageIcon from '@/components/global-component/g-image-icon/index.vue';
import GContainer from '@/components/global-component/g-container/index.vue';
// 全局组件end

// 全局方法
import { navigateSmoothTo } from '@/common/util';
import globalMixin from '@/common/mixins/global.js'

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
Vue.component('g-back', GBack);
Vue.component('g-tab-bar', GTabBar);
Vue.component('g-image-icon', GImageIcon);
Vue.component('g-container', GContainer);
// 全局组件end

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);
// #endif

// 全局混入
Vue.mixin(globalMixin);

Vue.prototype.$baseUrl = base_url;
Vue.prototype.$navigateSmoothTo = navigateSmoothTo;

const app = new Vue({
  store,
  ...App
});
app.$mount();

// router.js
import { RouterMount, createRouter } from 'uni-simple-router';
import $store from '@/store/index';
import { isDev } from '@/common/config.js';

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  routes: [...ROUTES],
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
  if (isDev) {
    console.log("/** ---- Router from to: ---- */", from, to);
    console.log("/** ---- Router log done. ---- */");
  }
  next();
});

// 全局路由后置守卫
router.afterEach((to, from) => {
  const userInfo = $store.getters.userInfo;
  if (Object.keys(userInfo).length <= 0) {
    this.$store.dispatch('user/GetUserInfo');
  }
});

export {
  router,
  RouterMount,
}

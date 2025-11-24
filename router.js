// router.js
import { RouterMount, createRouter } from 'uni-simple-router';
import $store from '@/store/index';
import { isDev } from '@/common/config.js';

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  routes: [...ROUTES],
});

if (isDev) {
  console.log("/** ---- ROUTES: ---- */");
  console.log(ROUTES)
  console.log('/** ---- TABBAR_PAGES: ---- */');
  console.log(TABBAR_PAGES);
  console.log("/** ---- ROUTES log done ---- */");
}

//全局路由前置守卫
router.beforeEach((to, from, next) => {
  if (isDev) {
    console.log("/** ---- Router from to: ---- */", from, to);
    console.log("/** ---- Router log done. ---- */");
  }
  next();
});

const formatPath = p => (p.startsWith('/') ? p : '/' + p);
const cleanPath = url => url.split('?')[0];
// 全局路由后置守卫
router.afterEach((to, from) => {
  const targetPath = to.path.replace(/^\//, ''); // 去掉开头 '/'
  const idx = TABBAR_PAGES.findIndex(item =>
    cleanPath(formatPath(item.pagePath)) == cleanPath(formatPath(targetPath))
  );
  if (idx >= 0) {
    $store.dispatch('navTabBar/SetTabBarIndex', idx);
  }

  const userInfo = $store.getters.userInfo;
  if (Object.keys(userInfo).length <= 0) {
    this.$store.dispatch('user/GetUserInfo');
  }
});

export {
  router,
  RouterMount,
}

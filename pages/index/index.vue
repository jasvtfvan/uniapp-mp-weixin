<template>
  <g-container :loading="loading">
    <view class="footer">
      <text>V{{ version }}</text>
    </view>
  </g-container>
</template>

<script>
import { version } from '@/common/config';
import { INDEX_ROUTE_MAP } from '@/common/constant.js';

// 解析二维码
function parseQrCode(q) {
  const [_, queryString] = decodeURIComponent(q).split('?');
  if (!queryString) return {};
  const pairs = queryString.split('&').reduce((acc, cur) => {
    const [k, v] = cur.split('=');
    acc[k] = v;
    return acc;
  }, {});
  return pairs;
}

export default {
  data() {
    return {
      loading: true,
      version,
    };
  },
  onLoad(option) {
    /**
     * 参数的两种方式：
     * 1，扫码进来
     * { q: 'https://xxx/yyy?route=someRoute&param1=123', scancode_time: 168xxx }
     * 2，跳转进来
     * uni.navigateTo({ url: '/pages/index/index?route=someRoute&param1=123' });
     */
    option = option || {};
    console.log('/** ---- index option ---- */', option);

    // 区分“扫码场景”还是“普通跳转”
    const isScan = option.q && option.scancode_time;
    const scanParams = isScan ? parseQrCode(option.q) : {};
    const allParams = { ...option, ...scanParams };

    this.route = allParams.route || 'home';
    this.params = allParams;
  },
  onShow() {
    setTimeout(() => {
      this.code2Session();
    }, 1000);
  },
  methods: {
    // 获取微信小程序session（用于获取头像、手机号等信息）
    code2Session() {
      const sessionKey = this.$store.getters.sessionKey;
      if (!sessionKey) {
        // #ifdef MP-WEIXIN
        uni.login({
          provider: 'weixin',
          success: (codeRes) => {
            const { code } = codeRes;
            this.$store
              .dispatch('session/Code2Session', { code })
              .then((res) => {
                this.routeToByToken();
              });
          },
        });
        // #endif

        // #ifndef MP-WEIXIN
        this.routeToByToken();
        // #endif
      } else {
        this.routeToByToken();
      }
    },
    // 根据token判断跳转
    routeToByToken() {
      const token = this.$store.getters.token;
      if (token) {
        this.loadBasicData();
        this.loadUserInfo();
      } else {
        this.routeToFeature('login');
      }
    },
    // 加载主数据和codeList
    loadBasicData() {
      this.$store.dispatch('masterData/InitMasterData', {
        actions: [
          'GetMasterOuterLink',
        ],
        force: true,
      });
      this.$store.dispatch('codeList/GetCodeKindList');
    },
    // 加载用户信息
    loadUserInfo() {
      this.$store.dispatch('user/GetUserInfo')
        .then((res) => {
          const { userStatus = 0 } = res.data || {};
          if (userStatus == 1) { // 未登录
            this.routeToFeature('login');
          } else if (userStatus == 2) { // 已登录
            this.routeToFeature(this.route);
          } else { // 未注册
            this.routeToFeature('register');
          }
        });
    },
    routeToFeature(targetRoute) {
      if (!targetRoute || !INDEX_ROUTE_MAP[targetRoute]) {
        targetRoute = 'home';
      }
      if (this.params.route && !INDEX_ROUTE_MAP[targetRoute].middlePage) {
        delete this.params.route;
      }

      const params = this.params || {};
      let queryStr = Object.keys(params)
        .map(k => `${k}=${encodeURIComponent(params[k])}`)
        .join('&');
      queryStr = queryStr ? `?${queryStr}` : '';

      if (INDEX_ROUTE_MAP[targetRoute].url) {
        const entry = INDEX_ROUTE_MAP[targetRoute];
        entry['type'] = entry.type || 'navigateSmoothTo';
        let targetPath = `${entry.url}${queryStr}`;
        if (targetPath.startsWith('/')) {
          targetPath = targetPath.substring(1);
        }

        if (uni[entry.type]) { // navigateTo redirectTo ... ...
          if (entry.type == 'switchTab') {
            this.$navigateSmoothTo(targetPath);
          } else {
            uni[entry.type]({
              url: targetPath,
            });
          }
        } else {
          this.$navigateSmoothTo(targetPath);
        }
      } else {
        this.$navigateSmoothTo(`/pages/home/index${queryStr}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 100rpx;
  width: 100%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 26rpx;
    font-weight: 400;
    color: #7f7f7f;
  }
}
</style>

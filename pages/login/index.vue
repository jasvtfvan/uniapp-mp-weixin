<template>
  <g-container>
    <view class="body">
      <view class="form">
        <view class="form-item">
          <u--input placeholder="请输入姓名" border="surround" v-model="username"></u--input>
        </view>
        <view class="form-item">
          <u--input placeholder="请输入密码" password border="surround" v-model="password"></u--input>
        </view>
        <view class="form-item">
          <ci-button @click="login">登录</ci-button>
        </view>
      </view>
    </view>
		<view class="footer">
			<text>V{{ version }}</text>
		</view>
  </g-container>
</template>

<script>
import { version } from '@/common/config';
import { INDEX_ROUTE_MAP } from '@/common/constant.js';
import CiButton from '@/components/ui-component/ci-button/index.vue';

export default {
  components: {
    CiButton,
  },
  data() {
    return {
      version,
      username: '',
      password: '',
    };
  },
  onLoad(option) {
    /**
     * { route: 'someRoute', param1: '123' }
     */
    option = option || {};
    console.log('/** ---- login option ---- */', option);

    this.route = option.route || 'home';
    this.params = { ...option };
  },
  methods: {
    login() {
      let that = this;
      const username = that.username;
      const password = that.password;
      if (!username) {
        uni.showToast({
          title: '姓名不可为空',
          icon: 'none',
        });
        return false;
      }
      if (!password) {
        uni.showToast({
          title: '密码不可为空',
          icon: 'none',
        });
        return false;
      }
      this.loginBySession({ username, password });
    },
    loginBySession(data) {
      const sessionKey = this.$store.getters.sessionKey;
      this.$store
        .dispatch('token/LoginBySession', { sessionKey, ...data })
        .then(() => {
          this.loadBasicData();
          this.loadUserInfo();
        });
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

<style lang="scss">
.body {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-content: center;
  justify-content: center;
}

.form {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  .form-item {
    margin: 20rpx 0rpx;
  }
}

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

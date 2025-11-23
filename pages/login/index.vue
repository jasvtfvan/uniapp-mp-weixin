<template>
  <g-container>
    <view class="body">
      <view class="form">
        <view class="form_cell">
          <u--input placeholder="经销商授权码" v-model="dealerRandomCode"></u--input>
          <u-icon name="scan" @click="doScan" size="64rpx"></u-icon>
        </view>
        <view @click="signIn" class="login_btn">欢迎使用</view>
      </view>
    </view>
  </g-container>
</template>

<script>
import { INDEX_ROUTE_MAP } from '@/common/constant.js';

export default {
  data() {
    return {
      dealerRandomCode: '',
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
    doScan() {
      let that = this;
      uni.scanCode({
        success: function (res) {
          that.dealerRandomCode = res.result;
        },
      });
    },
    signIn() {
      let that = this;
      // 4108641199852617728
      const dealerRandomCode = that.dealerRandomCode;
      if (!dealerRandomCode) {
        uni.showToast({
          title: '授权码不可为空',
          icon: 'none',
        });
        return false;
      }
      this.loginBySession(dealerRandomCode);
    },
    loginBySession(dealerRandomCode) {
      const sessionKey = this.$store.getters.sessionKey;
      this.$store
        .dispatch('token/LoginBySession', { sessionKey, dealerRandomCode })
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
          uni[entry.type]({
            url: targetPath,
          });
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
  // background-repeat: no-repeat;
  // background-size: 100%;
  // background-position: top;
  background: linear-gradient(to bottom, #050504, #050504, #000000);
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}

.form {
  position: absolute;
  top: 998rpx;
  left: 40rpx;
}

.form_cell {
  width: 670rpx;
  height: 88rpx;
  background: #ffffff #111111;
  border: 2rpx solid #404040;
  box-sizing: border-box;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.form_cell input {
  font-size: 32rpx !important;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400 !important;
  color: #808080 !important;
  line-height: 28rpx !important;
}

.form_cell_right {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #00adef;
  line-height: 40rpx;
  border-left: 2rpx solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  padding-left: 30rpx;
}

.login_btn {
  margin-top: 80rpx;
  width: 670rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 46rpx;
  background-color: #00adef;
}

.u-icon {
  position: relative;
  right: -10rpx;
}
</style>

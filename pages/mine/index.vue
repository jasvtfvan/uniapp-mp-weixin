<template>
  <g-container>
    <g-nav title="我的">
      <view slot="left"></view>
    </g-nav>
    <view class="content">
      <view class="img-wrap">
        <image class="welcome-image" src="/static/images/common/welcome.png" />
      </view>
      <ci-button @click="doLogout">退出</ci-button>
    </view>
    <g-tab-bar />
  </g-container>
</template>

<script>
import CiButton from '@/components/ui-component/ci-button/index.vue';

export default {
  components: {
    CiButton,
  },
  data() {
    return {};
  },
  onLoad() { },
  onShow() {
    this.$store.dispatch('navTabBar/SetTabBarIndex', 2);
  },
  methods: {
    doLogout() {
      this.$store.dispatch('user/Logout').then(() => {
        const targetPath = 'pages/index/index';
        this.$navigateSmoothTo(targetPath);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 70rpx 0rpx 35rpx 0rpx;
  position: relative;

  .img-wrap {
    display: flex;
    justify-content: center;
    .welcome-image {
      width: 642rpx;
      height: 336rpx;
    }
  }
}
</style>

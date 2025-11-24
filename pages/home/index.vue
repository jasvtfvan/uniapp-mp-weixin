<template>
  <g-container>
    <view class="content" :style="{ height: `${height}px` }">
      <image class="welcome-image" src="/static/images/common/welcome.png" />
    </view>
    <g-tab-bar />
  </g-container>
</template>

<script>
export default {
  data() {
    return {
      height: null,
    };
  },
  onShow() { },
  computed: {
    navHeight() {
      return this.$store.getters.navHeight || 0;
    },
    tabBarHeight() {
      return this.$store.getters.tabBarHeight || 0;
    },
    surplusHeight() {
      return this.navHeight + this.tabBarHeight;
    },
  },
  watch: {
    surplusHeight: {
      handler(newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          this.height = this.getContentHeight(newVal);
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 高度
    getContentHeight(surplusHeight) {
      const sys = this.$u.sys();
      const { screenHeight } = sys;
      // const buffer = 29; // 底部tabbar背景图和水平线之间的距离
      const buffer = 0;
      return screenHeight - surplusHeight + buffer;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  height: calc(100vh - 78px - env(safe-area-inset-bottom) - 44px - env(safe-area-inset-bottom));
}

.welcome-image {
  width: 642rpx;
  height: 336rpx;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
</style>

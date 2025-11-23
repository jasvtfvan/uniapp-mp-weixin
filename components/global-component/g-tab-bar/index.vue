<template>
  <view>
    <view
      class="g-tabbar-placeholder"
      :style="{
        height: placeholderHeight + 'px',
      }"
    ></view>
    <view class="g-tabbar-tabbar-bg-wrap">
      <image
        class="g-tabbar-tabbar-bg"
        src="/static/images/common/tabbar-bg.png"
      ></image>
      <view class="u-safe-bottom u-safe-area-inset-bottom"></view>
    </view>
    <u-tabbar :placeholder="false" :value="index">
      <u-tabbar-item @click="clickPaper" text=" ">
        <view class="g-tabbar-item-wrap" slot="active-icon">
          <view class="badge-wrap" v-if="showPaperCount">
            <u-badge numberType="limit" max="99" :value="paperCount"></u-badge>
          </view>
          <view class="g-tabbar-icon-wrap">
            <g-image-icon name="tabbar-paper-active" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-active">试卷</text>
        </view>
        <view class="g-tabbar-item-wrap" slot="inactive-icon">
          <view class="badge-wrap" v-if="showPaperCount">
            <u-badge numberType="limit" max="99" :value="paperCount"></u-badge>
          </view>
          <view class="g-tabbar-icon-wrap">
            <g-image-icon name="tabbar-paper-inactive" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-inactive">试卷</text>
        </view>
      </u-tabbar-item>
      <u-tabbar-item @click="clickHome" text=" ">
        <view class="g-tabbar-item-wrap g-tabbar-home" slot="active-icon">
          <view class="g-tabbar-icon-wrap-large">
            <g-image-icon name="tabbar-home-active" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-active">首页</text>
        </view>
        <view class="g-tabbar-item-wrap g-tabbar-home" slot="inactive-icon">
          <view class="g-tabbar-icon-wrap-large">
            <g-image-icon name="tabbar-home-inactive" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-inactive">首页</text>
        </view>
      </u-tabbar-item>
      <u-tabbar-item @click="clickMine" text=" ">
        <view class="g-tabbar-item-wrap" slot="active-icon">
          <view class="g-tabbar-icon-wrap">
            <g-image-icon name="tabbar-mine-active" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-active">我的</text>
        </view>
        <view class="g-tabbar-item-wrap" slot="inactive-icon">
          <view class="g-tabbar-icon-wrap">
            <g-image-icon name="tabbar-mine-inactive" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-inactive">我的</text>
        </view>
      </u-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      index: -1,
      placeholderHeight: 0,
    };
  },
  computed: {
    tabBarIndex() {
      return this.$store.getters.tabBarIndex;
    },
    paperCount() {
      return this.$store.getters.paperCount || 0;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
    showPaperCount() {
      const roles = (this.userInfo || {}).roles || [];
      return (roles.includes(0) || roles.includes('0')) && this.paperCount;
    },
  },
  watch: {
    tabBarIndex: {
      handler(val) {
        this.index = val == null ? -1 : val;
      },
      immediate: true,
    },
  },
  mounted() {
    this.setPlaceholderHeight();
  },
  methods: {
    async setPlaceholderHeight() {
      // 延时一定时间
      await uni.$u.sleep(20);
      // let tabBarHeight = 78;
      // const sys = this.$u.sys();
      // if (sys.safeAreaInsets && sys.safeAreaInsets.bottom) {
      //   tabBarHeight += sys.safeAreaInsets.bottom;
      // }
      // this.placeholderHeight = tabBarHeight;
      this.$uGetRect('.g-tabbar-tabbar-bg-wrap').then(({ height = 78 }) => {
        // 修复IOS safearea bottom 未填充高度
        this.placeholderHeight = height;
        this.$store.dispatch('navTabBar/SetTabBarHeight', height);
      });
    },
    clickPaper() {
      if (this.$store.getters.token) {
        const userInfo = this.$store.getters.userInfo;
        const { roles } = userInfo;
        if (roles.length > 0) {
          const targetPath = 'pages/paper/index';
          this.$navigateSmoothTo(targetPath);
        } else {
          const targetPath = 'pages/mine/index';
          this.$navigateSmoothTo(targetPath);
        }
      } else {
        uni.navigateTo({
          url: '/pages/login/index',
        });
      }
    },
    clickHome() {
      const targetPath = 'pages/index/index';
      this.$navigateSmoothTo(targetPath);
    },
    clickMine() {
      if (this.$store.getters.token) {
        const targetPath = 'pages/mine/index';
        this.$navigateSmoothTo(targetPath);
      } else {
        uni.navigateTo({
          url: '/pages/login/index',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.g-tabbar-tabbar-bg-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  .g-tabbar-tabbar-bg {
    width: 100%;
    height: 78px;
  }
}
.g-tabbar-icon-wrap {
  width: 17px;
  height: 17px;
}
.g-tabbar-icon-wrap-large {
  width: 44.5px;
  height: 44.5px;
}
.g-tabbar-placeholder {
  background: transparent;
}
.g-tabbar-item-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  &.g-tabbar-home {
    position: relative;
    top: -13.75px;
  }
  .g-tabbar-item-font {
    margin-top: 2px;
    font-size: 12px;
    color: #3a3e47;
    &.g-tabbar-active {
      color: #9ebaca;
    }
  }
  .badge-wrap {
    position: absolute;
    top: -20rpx;
    right: -20rpx;
  }
}
</style>

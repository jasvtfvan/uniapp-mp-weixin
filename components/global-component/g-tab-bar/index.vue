<template>
  <view>
    <view class="g-tabbar-placeholder" :style="{height: placeholderHeight + 'px'}"></view>
  
    <view class="g-tabbar-tabbar-bg-wrap">
      <image class="g-tabbar-tabbar-bg" src="/static/images/common/tabbar-bg.png"></image>
      <view class="u-safe-bottom u-safe-area-inset-bottom"></view>
    </view>
  
    <u-tabbar :placeholder="false" :value="currentIndex">
  
      <u-tabbar-item v-for="(item, index) in list" :key="index" @click="triggerSwitchTab(index, item.pagePath)">
        <view class="g-tabbar-item-wrap" slot="active-icon">
          <view :class="item.large ? 'g-tabbar-icon-wrap-large' : 'g-tabbar-icon-wrap'">
            <g-image-icon :name="item.activeIcon" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-active">{{item.text}}</text>
        </view>
        <view class="g-tabbar-item-wrap" slot="inactive-icon">
          <view :class="item.large ? 'g-tabbar-icon-wrap-large' : 'g-tabbar-icon-wrap'">
            <g-image-icon :name="item.inactiveIcon" />
          </view>
          <text class="g-tabbar-item-font g-tabbar-inactive">{{item.text}}</text>
        </view>
      </u-tabbar-item>
  
    </u-tabbar>
  </view>
</template>

<script>
const targetList = TABBAR_PAGES.map(item => {
  const activeIcon = item.selectedIconPath.replace(/^.*\//, '').replace(/^icon-/, '').replace(/\.\w+$/, '');
  const inactiveIcon = item.iconPath.replace(/^.*\//, '').replace(/^icon-/, '').replace(/\.\w+$/, '');
  const large = !!item.large;
  return {
    activeIcon,
    inactiveIcon,
    text: item.text,
    pagePath: item.pagePath,
    large: large,
  };
})

export default {
  props: {},
  data() {
    return {
      list: targetList,
      currentIndex: -1,
      placeholderHeight: 0,
    };
  },
  computed: {
    tabBarIndex() {
      return this.$store.getters.tabBarIndex;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  watch: {
    tabBarIndex: {
      handler(val) {
        this.currentIndex = val == null ? -1 : val;
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
    triggerSwitchTab(index, pagePath) {
      if (this.$store.getters.token) {
        this.$navigateSmoothTo(`${pagePath}`)
          .then(() => {
            this.$store.dispatch('navTabBar/SetTabBarIndex', index);
          });
      } else {
        this.$navigateSmoothTo(`/pages/index/index`)
          .then(() => {
            this.$store.dispatch('navTabBar/SetTabBarIndex', -1);
          })
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
  width: 26px;
  height: 26px;
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

<template>
  <view v-if="enabled">
    <!-- 1. 圆形悬浮按钮 -->
    <view class="debug-btn" :class="{ active: showDrawer }" @tap="toggle">
      <text class="debug-btn__txt">D</text>
    </view>
  
    <!-- 2. 遮罩 + 抽屉 -->
    <view v-show="showDrawer" class="debug-mask" @tap="toggle">
      <view class="debug-drawer" @tap.stop>
        <!-- 头部 -->
        <view class="debug-drawer__head">
          <text class="debug-drawer__title">Vuex State</text>
        </view>
        <view class="debug-drawer__body">
          <view class="debug-drawer__ops">
            <text class="debug-drawer__close" @tap="toggle">close</text>
            <text class="debug-drawer__clear" @tap="clearState">清空</text>
          </view>
          <!-- 可滚动内容区 -->
          <scroll-view scroll-y class="debug-drawer__scroll">
            <pre class="debug-drawer__code">{{ tree }}</pre>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { isDev } from '@/common/config.js';

export default {
  name: 'DebugPanel',
  data() {
    return {
      showDrawer: false
    }
  },
  computed: {
    // 只在开发环境出现
    enabled() {
      return isDev;
    },
    // 把整棵 state 格式化成带缩进的字符串
    tree() {
      return JSON.stringify(this.$store.state, null, 2)
    }
  },
  methods: {
    toggle() {
      this.showDrawer = !this.showDrawer
    },
    clearState() {
      this.$store.dispatch('resetState');
      uni.showToast({ title: '已重置', icon: 'none', duration: 500 })
    },
  }
}
</script>

<style scoped>
/* 圆形悬浮按钮 */
.debug-btn {
  position: fixed;
  right: 30rpx;
  bottom: 262rpx;
  /* 略高于 tabBar */
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #FFFFFF;
}

.debug-btn__txt {
  color: #52c41a;
  font-size: 24rpx;
  font-weight: bold;
}

/* 遮罩 */
.debug-mask {
  position: fixed;
  padding-top: calc(env(safe-area-inset-top) + 48px);
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9998;
}

/* 抽屉 */
.debug-drawer {
  position: fixed;
  padding-top: calc(env(safe-area-inset-top) + 48px);
  top: 0;
  right: 0;
  width: 75vw;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.25s ease-out;
  border: 1px solid #000000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

/* 头部 */
.debug-drawer__head {
  height: 23px;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #e5e5e5;
}

.debug-drawer__title {
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  height: 22px;
}

.debug-drawer__ops {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 0rpx 24rpx;
  height: 33px;
  border-bottom: 1rpx dashed #e5e5e5;
  margin-bottom: 5px;
}

.debug-drawer__clear {
  font-size: 14px;
  color: #e05d2a;
  padding: 0rpx 12rpx;
}

.debug-drawer__close {
  font-size: 18px;
  color: #999;
  padding: 0rpx 8rpx;
}

.debug-drawer__body {
  flex: 1;
}
.debug-drawer__scroll {
  box-sizing: border-box;
  padding: 0 24rpx;
  height: calc(100vh - 33px - 23px - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 48px - 10px);
}

.debug-drawer__code {
  font-size: 24rpx;
  line-height: 1.4;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
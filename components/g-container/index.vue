<template>
  <scroll-view
    class="g-container"
    :scroll-top="scrollTop"
    :scroll-with-animation="true"
    :scroll-x="activeScrollX"
    :scroll-y="activeScrollY"
    :refresher-enabled="refresherEnabled"
    :refresher-triggered="refresherTriggered"
    :style="{
      backgroundColor,
      borderTop: borderTopColor ? `2rpx solid ${borderTopColor}` : 'none',
    }"
    @scrolltolower="scrollToLower"
    @refresherpulling="refresherPulling"
    @refresherrefresh="refresherRefresh"
    @refresherrestore="refresherRestore"
    @refresherabort="refresherAbort"
    @click="click"
  >
    <ci-debug-panel />
    <slot />
    <ci-toast />
    <view class="loading-wrap" v-if="loading">
      <ci-loading />
    </view>
  </scroll-view>
</template>

<script>
import CiToast from '@/components/ci-toast/index.vue';
import CiLoading from '@/components/ci-loading/index.vue';
import CiDebugPanel from '@/components/ci-debug-panel/index.vue';
export default {
  components: {
    CiToast,
    CiLoading,
    CiDebugPanel,
  },
  props: {
    borderTopColor: {
      type: String,
      default: '',
    },
    backgroundColor: {
      type: String,
      default: 'transparent',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    scrollTop: {
      type: [Number, String],
      default: 0,
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
    scrollY: {
      type: Boolean,
      default: true,
    },
    refresherEnabled: {
      type: Boolean,
      default: false,
    },
    finishRefresh: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      refresherTriggered: false,
      _freshing: false,
    };
  },
  computed: {
    activeScrollX() {
      return !this.loading && this.scrollX;
    },
    activeScrollY() {
      return !this.loading && this.scrollY;
    },
  },
  watch: {
    finishRefresh: {
      handler(val) {
        if (val) {
          this.refresherTriggered = false;
          this._freshing = false;
        }
      },
      immediate: true,
    },
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 下拉刷新被中止
    refresherAbort(e) {
      this.$emit('refresherAbort', e);
    },
    // 下拉刷新被复位
    refresherRestore(e) {
      this.$emit('refresherRestore', e);
    },
    // 下拉刷新控件被下拉
    refresherPulling(e) {
      // 防止上滑页面也触发下拉
      if (e.detail.deltaY < 0) return;
      this.refresherTriggered = true;
      // this.$emit('refresherPulling', e);
    },
    // 下拉刷新被触发
    refresherRefresh(e) {
      if (this._freshing) return;
      this._freshing = true;
      this.$emit('update:finishRefresh', false);
      this.$emit('beginRefresh', e);
    },
    // 滚动到底部/右边，会触发
    scrollToLower(e) {
      this.$emit('scrollToLower', e);
    },
    click() {
      this.$emit('click');
    },
  },
};
</script>
<style lang="scss" scoped>
.g-container {
  width: 750rpx;
  height: 100%;
  position: relative;
  .loading-wrap {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>

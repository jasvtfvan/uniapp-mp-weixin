<template>
  <g-container>
    <g-nav></g-nav>
    <view class="content" :style="{ height: `${mixinGlobalHeight}px` }">
      <image class="welcome-image" src="/static/images/common/welcome.png" />
      <view class="button-wrap">
        <view class="button-item">
          <ci-button @click="navToDetail">跳到详情</ci-button>
        </view>
        <view class="button-item">
          <ci-button @click="openWebview">
            <text>
              跳到webview
            </text>
          </ci-button>
        </view>
      </view>
    </view>
    <g-tab-bar />
  </g-container>
</template>

<script>
import CiButton from '@/components/ui-component/ci-button/index.vue';
import { routeToOuterLink } from '@/common/util';

export default {
  components: {
    CiButton,
  },
  data() {
    return {
    };
  },
  onShow() { },
  computed: {
    masterLinkMap() {
      return this.$store.getters.masterLinkMap;
    },
  },
  watch: {},
  methods: {
    navToDetail() {
      this.$navigateSmoothTo(`/pages/detail/index`);
    },
    openWebview() {
      if (this.masterLinkMap.baidu) {
        routeToOuterLink(this.masterLinkMap.baidu);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 1px;
  position: relative;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
}

.welcome-image {
  width: 642rpx;
  height: 336rpx;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}

.button-wrap {
  margin-top: 20px;
  .button-item {
    margin: 20rpx 0rpx;
  }
}
</style>

<template>
  <g-container>
    <g-nav>
      <view slot="left">
        <view class="nav-wrap">
          这里可以填充自定义内容
        </view>
      </view>
    </g-nav>
    <view class="content">
      <view class="img-wrap">
        <image class="welcome-image" src="/static/images/common/welcome.png" />
      </view>
    </view>
    <g-tab-bar />
  </g-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() { },
  onShow() { },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.nav-wrap {
  color: #FFFFFF;
}

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

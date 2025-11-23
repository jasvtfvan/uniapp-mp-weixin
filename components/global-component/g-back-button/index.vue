<template>
  <view
    v-show="statusBarHeight"
    :style="{ top }"
    class="go-back"
    @click="click"
  ></view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0, // px
    };
  },
  computed: {
    top() {
      return this.statusBarHeight + 12.5 + 'px';
    },
  },
  created() {
    uni.getSystemInfo({
      success: (res) => {
        const { statusBarHeight } = res;
        this.statusBarHeight = statusBarHeight;
      },
    });
  },
  methods: {
    click() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss">
.go-back {
  position: absolute;
  top: 0rpx;
  left: 34rpx;
  width: 0rpx;
  height: 0rpx;
  z-index: 999;
}
.go-back::before,
.go-back::after {
  position: absolute;
  content: '';
  border-top: 17rpx dashed transparent;
  border-bottom: 17rpx dashed transparent;
}
.go-back:before {
  border-right: 18rpx solid #ccc;
}
.go-back:after {
  left: 4rpx; /*覆盖并错开*/
  border-right: 18rpx solid black;
}
</style>

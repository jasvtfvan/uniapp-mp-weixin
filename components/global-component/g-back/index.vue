<template>
  <view class="icon-wrap" @click="goBack">
    <g-svg-icon name="arrow-back" color="#FF3C3c" />
  </view>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: '',
    },
  },
  methods: {
    goBack() {
      if (this.path) {
        this.$navigateSmoothTo(this.path);
      } else {
        uni.navigateBack();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-wrap {
  width: 23px;
  height: 23px;
}
</style>

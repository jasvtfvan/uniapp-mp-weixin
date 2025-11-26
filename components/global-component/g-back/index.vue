<template>
  <view class="icon-wrap" @click="goBack">
    <g-image-icon :name="`arrow-back${number}`" />
  </view>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: '',
    },
    themeNumber: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    number() {
      if (!this.themeNumber || ![1,2,3,4,5].includes(this.themeNumber)){
        return 1;
      } else {
        return this.themeNumber;
      }
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

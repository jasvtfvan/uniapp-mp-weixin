<template>
  <view>
    <web-view :src="src"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      src: null,
    };
  },
  onLoad(option) {
    const { url } = option;
    this.src = decodeURIComponent(url);
  },
  onShow() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>

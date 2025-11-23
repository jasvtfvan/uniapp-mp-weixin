<template>
  <view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    uni.$on('toastShow', this.toastShow);
  },
  destroyed() {
    uni.$off('toastShow', this.toastShow);
  },
  methods: {
    toastShow(e) {
      this.$refs.uToast.show(e);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

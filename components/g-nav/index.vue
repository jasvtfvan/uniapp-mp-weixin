<template>
  <u-navbar
    bgColor="#1D1F22"
    placeholder
    :title="title"
    :titleStyle="titleStyle"
  >
    <template slot="left">
      <slot name="left"> </slot>
    </template>
  </u-navbar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      value: '',
    },
  },
  data() {
    return {
      titleStyle: {
        color: '#ffffff',
      },
    };
  },
  mounted() {
    this.setNavHeight();
  },
  methods: {
    async setNavHeight() {
      await uni.$u.sleep(20);
      const navHeight =
        this.$u.getPx(uni.$u.props.navbar.height) +
        this.$u.sys().statusBarHeight;
      this.$store.dispatch('navTabBar/SetNavHeight', navHeight);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

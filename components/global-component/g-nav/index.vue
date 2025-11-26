<template>
  <u-navbar
    :bgColor="bgColor"
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
    bgColor: {
      type: String,
      default: 'transparent',
    },
    title: {
      type: String,
      default: '',
    },
    titleColor: {
      type: String,
      default: '#000000',
    },
  },
  data() {
    return {
      titleStyle: {
        color: this.titleColor,
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

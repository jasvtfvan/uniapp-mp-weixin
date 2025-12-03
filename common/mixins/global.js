export default {
  data() {
    return {
      mixinGlobalHeight: 0,
    };
  },
  computed: {
    mixinGlobalNavHeight() {
      return this.$store?.getters?.navHeight || 0
    },
    mixinGlobalTabBarHeight() {
      return this.$store?.getters?.tabBarHeight || 0
    },
    mixinGlobalSurplusHeight() {
      return this.mixinGlobalNavHeight + this.mixinGlobalTabBarHeight;
    },
  },
  watch: {
    mixinGlobalSurplusHeight: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.mixinGlobalHeight = this.mixinGlobalGetContentHeight(newVal);
        }
      },
      immediate: true,
    },
  },
  methods: {
    mixinGlobalGetContentHeight(surplusHeight) {
      const sys = uni.getSystemInfoSync();
      const { windowHeight } = sys;
      // const buffer = 29; // 底部tabbar背景图和水平线之间的距离
      const buffer = 0;
      return windowHeight - surplusHeight + buffer;
    },
  },
}

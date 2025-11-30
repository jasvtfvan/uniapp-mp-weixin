<template>
  <image :src="src" class="g-image-icon"></image>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    src() {
      return require(`@/static/icons/image/icon-${this.name}.png`);
    },
  },
};
</script>
<style lang="scss" scoped>
.g-image-icon {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <button
    hover-class="button-hover"
    :class="{
      block,
      plain,
      middle,
      disabled,
    }"
    :disabled="disabled"
    @click="click"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    middle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  width: 210rpx;
  height: 70rpx;
  background: rgba(0, 185, 255, 0.2);
  border-radius: 12rpx;
  font-size: 34rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 400;
  color: #00b9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  &.block {
    width: 680rpx;
    height: 120rpx;
  }
  &.plain {
    border: 2rpx solid #00b9ff;
    background: transparent;
  }
  &.middle {
    font-size: 28rpx;
  }
  &.disabled {
    background: #4a4c4e;
    color: #9ebaca;
  }
  ::v-deep text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
// 点击时样式
.button-hover {
  opacity: 0.7;
}
</style>

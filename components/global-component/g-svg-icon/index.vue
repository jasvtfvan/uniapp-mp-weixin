<template>
  <image v-if="svgData" :src="svgData" class="g-svg-icon" mode="aspectFit"></image>
  <view v-else></view>
</template>

<script>
import { isMpWeiXin } from '@/common/config';
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      svgData: '',
    };
  },
  watch: {
    name: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.loadSvg();
        }
      },
      immediate: true,
    },
    color: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.loadSvg();
        }
      },
      immediate: true,
    },
  },
  methods: {
    loadSvg() {
      const path = `/static/icons/svg/icon-${this.name}.svg`;
      if (isMpWeiXin) {
        const fileSystemManger = uni.getFileSystemManager();
        fileSystemManger.readFile({
          filePath: path,
          encoding: 'utf8',
          success: r => this.changeColor(r.data),
          fail: (err) => {
            console.error('loadSvg--error:', err);
          },
        })
      } else {
        fetch(path)
          .then(r => r.text())
          .then(t => {
            if (!t.includes('<svg')) {
              throw { errMsg: `readFile:fail ${path} not found` };
            }
            this.changeColor(t);
          })
          .catch(err => console.error('loadSvg--error:', err));
      }
    },
    changeColor(raw) {
      const svg = raw.replace(
        /(fill|stroke)="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?"/g,
        `$1="${this.color}"`
      );
      const arrayBuffer = new Uint8Array(
        [].map.call(svg, c => c.charCodeAt(0))
      ).buffer;
      this.svgData = 'data:image/svg+xml;base64,' + uni.arrayBufferToBase64(arrayBuffer);
    },
  },
};
</script>

<style lang="scss" scoped>
.g-svg-icon {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentColor;
  overflow: hidden;
}
</style>

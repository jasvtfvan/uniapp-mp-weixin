<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
page {
	width: 100%;
	height: 100%;
}

.u-block {
  padding: 14rpx;

  &__section {
    margin-bottom: 10rpx;
  }

  &__title {
    margin-top: 10rpx;
    font-size: 15rpx;
    color: $u-content-color;
    margin-bottom: 10rpx;
  }

  &__flex {
    display: flex;
  }
}

view {
  box-sizing: border-box;
}

image {
  display: block;
}
</style>

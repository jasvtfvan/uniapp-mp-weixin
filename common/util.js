// 平滑跳转，如果找到栈中的进行navigateBack操作，如果栈中没有进行navigateTo操作
// 适用于底部导航栏菜单
const formatPath = p => (p.startsWith('/') ? p : '/' + p);
const cleanPath = url => url.split('?')[0];

export function navigateSmoothTo(targetPath) {
  return new Promise((resolve, reject) => {

    // [{route:'pages/index/index'},{route:'pages/product/grid'},{route:pages/product/gridDetail9}]
    const currentPages = getCurrentPages();
    // 返回的页面数，如果 delta 大于现有页面数，则返回到首页。currentPages.length = MaxDelta + 1。如果找不到直接返回首页。
    const rootDelta = currentPages.length;
    if (!targetPath || targetPath.length <= 1) {
      uni.navigateBack({
        delta: rootDelta,
      });
      uni.showToast({
        title: '目标导航为空',
        duration: 2000,
      });
      return reject('目标导航为空');
    }
    if (targetPath.startsWith('/')) {
      targetPath = targetPath.substring(1);
    }
    const currentPath = currentPages[currentPages.length - 1].route;
    if (currentPath == targetPath) {
      // uni.showToast({
      //   title: '目标为当前页面，无需跳转',
      //   duration: 2000,
      // });
      return resolve('目标为当前页面，无需跳转');
    }

    console.warn('currentPath|=>|targetPath', currentPath, targetPath);

    const isTabBar = TABBAR_PAGES.some(item =>
      cleanPath(formatPath(item.pagePath)) === cleanPath(formatPath(targetPath))
    )
    if (isTabBar) {
      uni.switchTab({
        url: `/${targetPath}`,
        success: () => resolve('switchTab'),
        fail: err => reject(err)
      });
      console.log('switchTab')
      return;
    }

    let delta = -1;
    for (let i = 0; i < currentPages.length; i++) {
      const pageObj = currentPages[i];
      if (pageObj.route == targetPath) {
        delta = currentPages.length - 1 - i;
        break;
      }
    }
    if (delta == -1) {
      uni.navigateTo({
        url: `/${targetPath}`,
        success: () => resolve('navigateTo'),
        fail: err => reject(err)
      });
    } else {
      if (delta === 0) {
        return resolve('目标为当前页面，无需跳转');
      }
      uni.navigateBack({
        delta,
        success: () => resolve('navigateBack'),
        fail: err => reject(err)
      });
    }

  });
}

// 判断空值
export function isEmpty(str) {
  return (
    typeof str === 'undefined'
    || str == null
    || str === ''
    || str === 'null'
    || str === 'NULL'
    || str === undefined
    || str === 'undefined'
  );
}

// 跳转到outer页面
export function routeToOuterLink(url) {
  return new Promise((resolve, reject) => {
    if (!url || url.length <= 1) {
      const currentPages = getCurrentPages();
      const rootDelta = currentPages.length;
      uni.navigateBack({
        delta: rootDelta,
      });
      uni.showToast({
        title: '目标导航为空',
        duration: 2000,
      });
      return reject('目标导航为空');
    }
    uni.navigateTo({
      url: `/pages/outer/index?url=${url}`,
      success: () => resolve('navigateTo'),
      fail: err => reject(err)
    });
  });
}

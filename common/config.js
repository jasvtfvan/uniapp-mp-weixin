/** -------- 基础信息（可修改） 开始 -------- */
let base_url = 'https://example.daily.com/';
let version = '1.0.0';
let isProd = false; // H5打包时需要修改，小程序无需修改
/** -------- 基础信息（可修改） 结束 -------- */

const systemInfo = uni.getSystemInfoSync();

/** -------- 环境信息（不可修改） 开始 -------- */
const isMpWeiXin = systemInfo.uniPlatform === 'mp-weixin';
let isDev = false;
if (isMpWeiXin) {
  isDev = (systemInfo.platform && systemInfo.platform == 'devtools');
} else {
  isDev = process.env.NODE_ENV == 'development';
}
/** -------- 环境信息（不可修改） 结束 -------- */

if (isMpWeiXin) {
  if (__wxConfig) {
    const envVersion = __wxConfig.envVersion;
    if (envVersion == 'release') {
      isProd = true;
    } else {
      isProd = false;
    }
  }
}

export default base_url;
export {
  version,
  isProd,
  isDev,
  isMpWeiXin,
};

const systemInfo = uni.getSystemInfoSync();
const isDev = (systemInfo.platform && systemInfo.platform == 'devtools');

let base_url = ""

let isWxDev = false;
if (__wxConfig) { // 微信小程序
  const envVersion = __wxConfig.envVersion;
  if (envVersion != 'release') {
    // ------开发环境--------
    base_url = 'https://xxx.uat.77qiku.com/';
    isWxDev = true;
  } else {
    // ------生产环境--------
    base_url = 'https://xxx.77qiku.com/';
    isWxDev = false;
  }
}

const version = '0.0.1';

export default base_url;
export {
  isDev,
  isWxDev as isUAT,
  version,
};

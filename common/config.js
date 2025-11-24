const systemInfo = uni.getSystemInfoSync();
const isDev = (systemInfo.platform && systemInfo.platform == 'devtools');

let base_url = ""

let isWxDev = false;
if (__wxConfig) { // 微信小程序
  const envVersion = __wxConfig.envVersion;
  if (envVersion != 'release') {
    // ------开发环境--------
    base_url = 'https://xxx.uat.daily.com/';
    isWxDev = true;
  } else {
    // ------生产环境--------
    base_url = 'https://xxx.daily.com/';
    isWxDev = false;
  }
}

const version = '1.0.0';

export default base_url;
export {
  isDev,
  isWxDev as isUAT,
  version,
};

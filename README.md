# 官方文档

1. uni-app
[https://uniapp.dcloud.net.cn/](https://uniapp.dcloud.net.cn/)

2. HBuilder X
[https://hx.dcloud.net.cn/](https://hx.dcloud.net.cn/)
>目前版本号：4.85
>依赖插件：scss/sass编译、uni-app（vue2）编译、uni-helpers、JavaScript运行调试

3. uView2.0
[https://uviewui.com/](https://uviewui.com/)
>目前版本：2.0.38

4. 微信官方文档.小程序
[https://developers.weixin.qq.com/miniprogram/dev/framework/](https://developers.weixin.qq.com/miniprogram/dev/framework/)

5. 微信公众平台
[https://mp.weixin.qq.com/cgi-bin/loginpage](https://mp.weixin.qq.com/cgi-bin/loginpage)


# 微信小程序
## 基础库

* 支持canvas原声组件在scroll-view中使用`2.4.4`及以上(这里使用3.11.2)
* 支持getFileSystemManager使用`2.19.2`以及上(这里使用3.11.2)
* 对应微信版本:ios大于等于 `8.0.24`
* 对应微信版本:android大于等于 `8.0.24`
* 对应文档目录:`指南`->`基础库`->`版本分析`
* 需要配置的位置
> * 微信开发者工作->本地设置<br>
> * 小程序web管理页面->设置->基础库最低版本设置
## 配置相关
1. AppID `wx59ffb6d08462ffd2`



# HBuilder创建项目

1. 利用`HBuilder`创建新项目，选择`默认模版`、`vue2.0`
>>目前的插件市场，绝大多数不支持`vue3.0`

2. 初始化`npm`
```sh
npm init -y
```

3. 安装`uView2.0`
```sh
npm install uview-ui@2.0.38
```

4. `main.js`中引入全局`uView`，要放在`import Vue`之后
```js
// 引入全局uView
import uView from "uview-ui";
// ... ...
Vue.use(uView);
```

5. 添加全局变量文件到`uni.scss`
```scss
@import 'uview-ui/theme.scss';
/* 颜色变量 */
// ... ...
```

6. `App.vue`引入基础样式
```scss
<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uview-ui/index.scss';
// ... ...
</style>
```

7. `pages.json`配置`easycom`规则（按需引入）
```json
"easycom": {
  "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue"
},
"pages": {
  // ... ...
}
```

8. 初始化`git`
```sh
git init
```
添加`.gitignore`文件（详见代码）



# 导入项目
1. git拉取代码
2. HBuilder导入项目
3. VSCode导入项目
4. 执行`npm install`



# 技术避坑
1. 在ios下，在dom结构中`scroll-view`如何在弹出框下边，则弹出时会被遮盖，解决方法：
```scss
view {
  // -webkit-overflow-scrolling:touch;导致fixed失效
  -webkit-overflow-scrolling: auto;
}
```



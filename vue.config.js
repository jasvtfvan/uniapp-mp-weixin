//vue.config.js
const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()
const fs = require('fs')
const path = require('path')

const tfPages = new TransformPages({ includes: ['path', 'name', 'aliasPath'] })

const getTabBarPages = () => {
  const appJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'pages.json'), 'utf-8')
  )
  return (appJson.tabBar && appJson.tabBar.list
    ? appJson.tabBar.list.map(i => i.pagePath.replace(/^\//, ''))
    : [])
}

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          return JSON.stringify(tfPages.routes)
        }, true),
        TABBAR_PAGES: webpack.DefinePlugin.runtimeValue(() => {
          return JSON.stringify(getTabBarPages())
        }, true),
      })
    ]
  }
}

//vue.config.js
const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()

const fs = require('fs')
const path = require('path')

const pagesJsonPage = path.resolve(__dirname, 'pages.json')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({ includes: ['path', 'name', 'aliasPath'] })
          return JSON.stringify(tfPages.routes)
        }, true),
        TABBAR_PAGES: webpack.DefinePlugin.runtimeValue(() => {
          const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPage, 'utf-8'))
          const list = (pagesJson.tabBar && pagesJson.tabBar.list) || []
          return JSON.stringify(list)
        }, true),
      })
    ]
  }
}

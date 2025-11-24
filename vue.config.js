//vue.config.js
const TransformPages = require('uni-read-pages')
const fs = require('fs')
const path = require('path')

const srcPath = path.resolve(__dirname, 'pages.json')
const pagesJson = JSON.parse(fs.readFileSync(srcPath, 'utf-8'))

const { webpack } = new TransformPages()
const tfPages = new TransformPages({ includes: ['path', 'name', 'aliasPath'] })

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          return JSON.stringify(tfPages.routes)
        }, true),
        TABBAR_PAGES: webpack.DefinePlugin.runtimeValue(() => {
          const list = (pagesJson.tabBar && pagesJson.tabBar.list) || []
          return JSON.stringify(list)
        }, true),
      })
    ]
  }
}

//vue.config.js
const TransformPages = require('uni-read-pages')
const fs = require('fs')
const path = require('path')



/** ---- 是否使用 pages.json 里的 tabbar ---- */
const ENABLE_TABBAR = true

const srcPath = path.resolve(__dirname, 'pages.config.json')
const dstPath = path.resolve(__dirname, 'pages.json')

const pagesConfigJson = JSON.parse(fs.readFileSync(srcPath, 'utf-8'))
const outPages = { ...pagesConfigJson }
if (!ENABLE_TABBAR) {
  delete outPages.tabBar
} else {
  outPages.tabBar = outPages.tabBar || { list: [] }
}

fs.writeFileSync(dstPath, JSON.stringify(outPages, null, 2))
/** -------------------------------------- */



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
          const list = (outPages.tabBar && outPages.tabBar.list) || []
          return JSON.stringify(list.map(i => i.pagePath.replace(/^\//, '')))
        }, true),
      })
    ]
  }
}

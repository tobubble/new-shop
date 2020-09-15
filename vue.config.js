const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'content': 'components/content',
        'common': '@/common',
        'network': '@/network',
        'assets': '@/assets',
        'views': '@/views',
        'plugins': '@/plugins'
      }
    }
  },
  // lintOnSave: false,
  // chainWebpack: config => {
  //   const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
  //   types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  // },
  // module: {
  //   rules: [
  //     {
  //       test: /\.less$/,
  //       loader: 'less-loader', // 将 Less 文件编译为 CSS 文件
  //     },
  //   ],
  // },
}


function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/css/global.less'),
      ],
    })
}
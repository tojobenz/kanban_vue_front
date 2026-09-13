module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  devServer: {
    port: 8081
  },
  configureWebpack: {
    optimization: {
      minimize: false
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Kanban Board';
      return args;
    });
  }
}
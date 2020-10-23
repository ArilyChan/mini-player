module.exports = {
  // 选项...
  publicPath: '',
  pwa: {
    name: 'arilychan radio',
    themeColor: '#DFE7EF',
    msTileColor: '#ACB8CC',
    manifestOptions: {
      background_color: '#DFE7EF'
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
}

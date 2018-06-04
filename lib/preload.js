const formatter = require('./formatter');
const path = require('path');

/**
 * Inject eslint-loader into webpackConfig,
 * effects /\.(js|jsx)$/
 */
module.exports = async function preload() {
  const isProd = process.env.DN_CMD === 'build';

  const eslintLoader = {
    test: /\.(js|jsx)$/,
    include: path.resolve(this.cwd, 'src'),
    exclude: /node_modules/,
    enforce: 'pre',
    loader: [{
      loader: require.resolve('eslint-loader'),
      options: {
        cache: !isProd,
        formatter,
      },
    }],
  };

  this.on('webpack.config', (webpackConf) => {
    if (Array.isArray(webpackConf.module.loaders)) {
      webpackConf.module.loaders.unshift(eslintLoader);
    } else {
      // eslint-disable-next-line no-param-reassign
      webpackConf.module.loaders = [eslintLoader];
    }
  });
};

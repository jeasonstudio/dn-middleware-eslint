const eslintInit = require('./init');
const copyEslintrc = require('./cprc');
const injectPreloader = require('./preload');
const runLint = require('./lint');

/**
 * Eslint middleware for Dawn
 * @param {Object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function eslintMiddleware(opts) {
  // eslint ignore please use `.eslintignore`
  const { stage } = opts;

  // set default options
  /* eslint-disable no-param-reassign */
  opts.extendsName = opts.extendsName || 'airbnb-base';
  opts.eslintExtendsPackage = `eslint-config-${opts.extendsName}`;
  opts.npmAlias = opts.npmAlias || 'npm';
  opts.config = opts.config || {};
  /* eslint-enable no-param-reassign */

  // eslint-disable-next-line func-names
  return async function (next) {
    if (stage === 'init') {
      // Repo init
      await eslintInit.call(this, opts);
      await copyEslintrc.call(this, opts);
    } else if (stage === 'preload') {
      // Inject webpack loader
      await injectPreloader.call(this, opts);
    } else {
      // Just run lint[ and auto fix].
      await runLint.call(this, opts);
    }
    next();
  };
};

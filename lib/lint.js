const path = require('path');

module.exports = async function lint(opts) {
  const {
    global = '$,jQuery', ignore = [], env = 'browser,node', ext = '.js,.jsx',
    fix = false,
  } = opts;
  const eslintBin = path.resolve(this.cwd, './node_modules/.bin/eslint');

  this.console.info('Start linting...');
  await this.utils.exec(`
    ${eslintBin} \
    --global ${global} \
    ${ignore.length ? ignore.map(i => `--ignore-pattern ${i}`) : ''} \
    --env ${env} \
    --ext ${ext} \
    ./src \
    ${fix ? '--fix' : ''}
  `);
};

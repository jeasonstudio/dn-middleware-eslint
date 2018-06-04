const path = require('path');

/**
 * Write .eslitrc.json file to repo
 * @param {Object} opts same as middleware
 */
module.exports = async function cprc({
  extendsName, parserOptions, env, plugins,
  golbals, rules,
}) {
  // register event lint.rules
  // let users to change eslint rules
  this.emit('lint.rules', rules);
  const eslintrc = {
    extends: extendsName,
    parserOptions,
    env,
    plugins,
    golbals,
    rules,
  };
  await this.utils.writeFile(
    path.resolve(this.cwd, './.eslintrc.json'),
    JSON.stringify(eslintrc, null, '\t'),
  );

  this.console.info('Write `.eslintrc.json` file to your repo cwd.');
};

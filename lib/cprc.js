const path = require('path');
const fs = require('fs');

function existAndRemove(pathToRemove) {
  if (!fs.existsSync(pathToRemove)) return;
  fs.unlinkSync(pathToRemove);
}

/**
 * Write .eslitrc.yml file to repo
 * @param {Object} opts same as middleware
 */
module.exports = async function cprc({
  extendsName, config,
}) {
  const { console, utils, cwd } = this;
  // register event lint.rules
  // let users to change eslint rules
  this.emit('eslint.rules', config.rules || {});
  const eslintrc = {
    extends: extendsName,
    // Config can have parserOptions, env, plugins, golbals, rules, ...
    ...config,
  };

  await existAndRemove(path.resolve(cwd, './.eslintrc.json'));
  await existAndRemove(path.resolve(cwd, './.eslintrc.yml'));

  await utils.writeFile(
    path.resolve(cwd, './.eslintrc.yml'),
    utils.yaml.stringify(eslintrc)
  );

  console.info('Writen `.eslintrc.yml` file to your repo cwd.');
};

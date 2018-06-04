/**
 * Install eslint, extends and its peerDependencies as repo init.
 * @param {Object} opts same as middleware
 */
module.exports = async function init({ eslintExtendsPackage, npmAlias }) {
  // List peer deps
  const peerDependenciesString = await this.utils.exec.withResult(`${npmAlias} info "${eslintExtendsPackage}@latest" peerDependencies --json`);

  let peerDependencies = {};
  try {
    peerDependencies = JSON.parse(peerDependenciesString);
  } catch (e) {
    // Do nothing
  }

  // Install deps
  await this.utils.exec(`${npmAlias} install --no-save ${
    Object.entries(peerDependencies)
      .concat([[eslintExtendsPackage, 'latest']])
      .map(([packageName, version]) => `${packageName}@${version}`)
      .join(' ')
  }`);

  this.console.info(`Install ${eslintExtendsPackage} and its peerDependencies success.`);
};

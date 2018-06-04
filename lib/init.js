/**
 * Install eslint, extends and its peerDependencies as repo init.
 * @param {Object} opts same as middleware
 */
module.exports = async function init({
  extendsName, npmAlias, config,
}) {
  const { mod } = this.utils;
  // List peer deps
  const peerDependenciesString = await this.utils.exec.withResult(`${npmAlias} info "eslint-config-${extendsName}@latest" peerDependencies --json`);

  let peerDependencies = {};
  try {
    peerDependencies = JSON.parse(peerDependenciesString);
  } catch (e) {
    // Do nothing
  }

  const { parser, plugins = [] } = config;

  // Install extend
  await mod.install(extendsName, {
    flag: { 'no-save': true },
    version: 'latest',
    prefix: 'eslint-config',
  });

  // Install peerDependencies
  // Something goes worning if i use Promise.all()
  const pdl = Object.entries(peerDependencies);
  for (let index = 0; index < pdl.length; index++) {
    const [packageName, version] = pdl[index];
    // eslint-disable-next-line no-await-in-loop
    await mod.install(packageName, {
      flag: { 'no-save': true },
      version,
    });
  }

  // Install parser
  if (parser) {
    await mod.install(parser, { flag: { 'no-save': true } });
  }

  // Install plugins
  for (let index = 0; index < plugins.length; index++) {
    const plugin = plugins[index];
    // eslint-disable-next-line no-await-in-loop
    await mod.install(plugin, {
      flag: { 'no-save': true },
      prefix: 'eslint-plugin',
    });
  }

  this.console.info(`Install ${extendsName} and its peerDependencies success.`);
};

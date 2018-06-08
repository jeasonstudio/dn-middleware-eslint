/**
 * Install eslint, extends and its peerDependencies as repo init.
 * @param {Object} opts same as middleware
 */
module.exports = async function init({
  extendsName, config,
}) {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(extendsName) && typeof extendsName === 'string') extendsName = [extendsName];

  const { mod } = this.utils;
  const eslintConfigPrefix = 'eslint-config';
  const eslintPluginPrefix = 'eslint-plugin';

  const SCOPE_REGEXP = /^(@\S+?)\//i;
  const VERSION_REGEXP = /\S+?@(\S+)\s*/i;

  // Need Dawn Context support pkgname parse
  function parsePackageName(packageName, prefix) {
    const str = packageName || '';

    const scope = (SCOPE_REGEXP.exec(str) || [])[1];
    const version = (VERSION_REGEXP.exec(str) || [])[1];
    const name = str.replace(SCOPE_REGEXP, '')
      .split('@')[0].split(' ')[0];
    const namePrefix = [prefix || '', name].join('-');
    const fullName = scope && namePrefix ? `${scope}/${namePrefix}` : namePrefix;
    return {
      scope,
      version,
      name,
      prefix,
      fullName,
      fullNameAndVersion: fullName && version ? `${fullName}@${version}` : fullName,
    };
  }

  const getDepAndInstall = en => mod
    .getVersionInfo(parsePackageName(en, eslintConfigPrefix).fullName)
    .then(async ({ peerDependencies = {} }) => {
      // Install peerDependencies
      // Something goes worning if i use Promise.all()
      const pdl = Object.entries(peerDependencies);
      for (let index = 0; index < pdl.length; index += 1) {
        const [packageName, version] = pdl[index];
        // eslint-disable-next-line no-await-in-loop
        await mod.install(packageName, {
          flag: { 'no-save': true },
          version,
        });
        // eslint-disable-next-line no-await-in-loop
        await mod.install(en, {
          flag: { 'no-save': true },
          version: 'latest',
          prefix: eslintConfigPrefix,
        });
      }
    });

  for (let index = 0; index < extendsName.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await getDepAndInstall(extendsName[index]);
  }
  // extendsName.map(getDepAndInstall);

  const { parser, plugins = [] } = config;

  // Install parser
  if (parser) {
    await mod.install(parser, { flag: { 'no-save': true } });
  }

  // Install plugins
  for (let index = 0; index < plugins.length; index += 1) {
    const plugin = plugins[index];
    // eslint-disable-next-line no-await-in-loop
    await mod.install(plugin, {
      flag: { 'no-save': true },
      prefix: eslintPluginPrefix,
    });
  }

  this.console.info(`Install ${extendsName} and its peerDependencies success.`);
};

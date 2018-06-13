# dn-middleware-eslint

Dawn eslint 中间件

## Usage

```yml
init:
  - name: eslint
    extendsName: ali
    config:
      parser: babel-eslint
      plugins:
        - react
      globals:
        navigator: true
        window: true
      env:
        es6: true

dev:
  - name: clean
  - name: faked
  - name: eslint
  - name: webpack
    inject:
      - babel-polyfill
    entry:
      (0): ./src/scripts/*.js
    template: ./assets/*.html
    sourceMap: true
    common:
      disabled: true
    loose: true
    watch: true
    compress: false
  - name: server
  - name: browser-sync

eslint:
  - name: eslint
    fix: true
```

`eslint` 中间件主要有三部分功能:
* `eslint` 及其配置项的安装
* 结合 `webpack-loader` 开发过程中 `lint`
* 单独 `dn run eslint` 查错及自动修复

| 参数 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- |
| stage | String | '' | enum{init,preload,}(已废弃) |
| npmAlias | String | 'npm' | 即将废弃(已废弃) |
| extendsName | String[]|String | 'ali' | eslint-config-${extendsName} |
| config | Object | {} | 自定 eslint 配置, 将会在 init 时写入 .eslintrc.json |
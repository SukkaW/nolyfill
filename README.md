# no(po)lyfill

Speed up your package installation process, reduce your disk usage, extend the lifespan of your precious SSD by reducing your `node_modules` size.

## Why

While you embracing the latest features and security fixes by installing the latest Node.js LTS in your npms, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and many other packages maintained by ljharb are still trying to support the **long-dead** Node.js 4 by adding **tons** of polyfills. Those polyfills are inflating your `node_modules` size, wasting your disk space and making your `npm i` / `yarn` / `pnpm i` slow. And what's worse, ljharb uses the polyfill implementation even when the native version is available in the environment, which makes the code run slower.

Whether to support Node.js 4 is up to ljharb, but most of you should not be forced to install polyfills for a Node.js version that has been dead since [2018-04-30](https://github.com/nodejs/release).

## When not to use

- Your Node.js version is below `12.4.0`.
- You are targetting a environment that doesn't have full ES2019 support (which you really should use [core-js](https://github.com/zloirock/core-js) or [core-js-pure](https://github.com/zloirock/core-js) instead. It is significantly faster).

## How to use

### npm

Add the following lines to your `package.json`'s `overrides`:

```json
{
  "overrides": {
    "array-buffer-byte-length": "npm:@nolyfill/array-buffer-byte-length@latest",
    "array-includes": "npm:@nolyfill/array-includes@latest",
    "array.from": "npm:@nolyfill/array.from@latest",
    "array.prototype.find": "npm:@nolyfill/array.prototype.find@latest",
    "array.prototype.findlastindex": "npm:@nolyfill/array.prototype.findlastindex@latest",
    "array.prototype.flat": "npm:@nolyfill/array.prototype.flat@latest",
    "array.prototype.flatmap": "npm:@nolyfill/array.prototype.flatmap@latest",
    "array.prototype.tosorted": "npm:@nolyfill/array.prototype.tosorted@latest",
    "arraybuffer.prototype.slice": "npm:@nolyfill/arraybuffer.prototype.slice@latest",
    "function-bind": "npm:@nolyfill/function-bind@latest",
    "function.prototype.name": "npm:@nolyfill/function.prototype.name@latest",
    "get-symbol-description": "npm:@nolyfill/get-symbol-description@latest",
    "globalthis": "npm:@nolyfill/globalthis@latest",
    "gopd": "npm:@nolyfill/gopd@latest",
    "has": "npm:@nolyfill/has@latest",
    "has-property-descriptors": "npm:@nolyfill/has-property-descriptors@latest",
    "has-proto": "npm:@nolyfill/has-proto@latest",
    "is-array-buffer": "npm:@nolyfill/is-array-buffer@latest",
    "is-shared-array-buffer": "npm:@nolyfill/is-shared-array-buffer@latest",
    "object-keys": "npm:@nolyfill/object-keys@latest",
    "object.assign": "npm:@nolyfill/object.assign@latest",
    "object.entries": "npm:@nolyfill/object.entries@latest",
    "object.fromentries": "npm:@nolyfill/object.fromentries@latest",
    "object.groupby": "npm:@nolyfill/object.groupby@latest",
    "object.hasown": "npm:@nolyfill/object.hasown@latest",
    "object.values": "npm:@nolyfill/object.values@latest",
    "regexp.prototype.flags": "npm:@nolyfill/regexp.prototype.flags@latest",
    "string.prototype.matchall": "npm:@nolyfill/string.prototype.matchall@latest",
    "string.prototype.trim": "npm:@nolyfill/string.prototype.trim@latest",
    "string.prototype.trimend": "npm:@nolyfill/string.prototype.trimend@latest",
    "string.prototype.trimleft": "npm:@nolyfill/string.prototype.trimleft@latest",
    "string.prototype.trimright": "npm:@nolyfill/string.prototype.trimright@latest",
    "string.prototype.trimstart": "npm:@nolyfill/string.prototype.trimstart@latest",
    "typed-array-buffer": "npm:@nolyfill/typed-array-buffer@latest",
    "typed-array-byte-length": "npm:@nolyfill/typed-array-byte-length@latest",
    "typed-array-byte-offset": "npm:@nolyfill/typed-array-byte-offset@latest",
    "typed-array-length": "npm:@nolyfill/typed-array-length@latest"
  }
}
```

It is necessary to execute the `npm update` (which will rebuild the `package-lock.json` file) after adding `overrides`, due to [an unresolved confirmed bug of npm](https://github.com/npm/cli/issues/5850).

----

**nolyfill** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/nolyfill/graphs/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Mastodon [@sukka@acg.mn](https://acg.mn/@sukka) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Keybase [@sukka](https://keybase.io/sukka)

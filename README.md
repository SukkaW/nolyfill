# no(po)lyfill

Speed up your package installation process, reduce your disk usage, and extend the lifespan of your precious SSD by reducing your `node_modules` size.

## Why

While you embracing the latest features and security fixes by installing the latest Node.js LTS in your workspaces, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and many other packages maintained by ljharb are still trying to support the **long-dead** Node.js 4 by adding **tons** of polyfills. Those polyfills are inflating your `node_modules` size, wasting your disk space and making your `npm i` / `yarn` / `pnpm i` slow.

Whether to support Node.js 4 is up to ljharb, but most of you should not be forced to install polyfills for a Node.js version that has been dead since [2018-04-30](https://github.com/nodejs/release).

## How to use

### npm

Add the following lines to your `package.json`'s `overrides`:

```json
{
  "overrides": {
    "array-includes": "npm:@nolyfill/array-includes@latest",
    "array.prototype.findlastindex": "npm:@nolyfill/array.prototype.findlastindex@latest",
    "array.prototype.flat": "npm:@nolyfill/array.prototype.flat@latest",
    "array.prototype.flatmap": "npm:@nolyfill/array.prototype.flatmap@latest",
    "arraybuffer.prorotype.slice": "npm:@nolyfill/arraybuffer.prorotype.slice@latest",
    "function.prototype.name": "npm:@nolyfill/function.prototype.name@latest",
    "has": "npm:@nolyfill/has@latest",
    "object-keys": "npm:@nolyfill/object-keys@latest",
    "object.assign": "npm:@nolyfill/object.assign@latest",
    "object.entries": "npm:@nolyfill/object.entries@latest",
    "object.fromentries": "npm:@nolyfill/object.fromentries@latest",
    "object.values": "npm:@nolyfill/object.values@latest"
  }
}
```

Then run `npm update`.

----

**nolyfill** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/nolyfill/graphs/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Mastodon [@sukka@acg.mn](https://acg.mn/@sukka) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Keybase [@sukka](https://keybase.io/sukka)

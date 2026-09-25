declare module '@npmcli/map-workspaces' {
  import type { PackageJson } from '@package-json/types';

  interface MapWorkspacesOptions {
    cwd: string,
    pkg: PackageJson
  }
  /** Expand the `workspaces` field of a package.json into a map of workspace name -> absolute directory */
  function mapWorkspaces(options: MapWorkspacesOptions): Promise<Map<string, string>>;
  export default mapWorkspaces;
}

declare module '@nolyfill/promise.any' {
  function _any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
  function _any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
  export default _any;
}

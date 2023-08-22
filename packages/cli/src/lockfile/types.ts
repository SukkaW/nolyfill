export interface PackageNode {
  name: string,
  version: string,
  dependencies?: PackageNode[],

  _seen?: boolean
}

export type HashAlgorithm = 'sha256' | 'sha384' | 'sha512'
export type ComputeResourceType = 'script' | 'link'
type ResourceType = Record<ComputeResourceType, boolean>

export interface Options {
  algorithm?: HashAlgorithm
  resourceType?: ResourceType
  /** 需要处理的资源匹配规则 */
  include?: string | RegExp | (string | RegExp)[]
  /** 排除处理的资源匹配规则 */
  exclude?: string | RegExp | (string | RegExp)[]
  /** crossorigin属性设置，默认'anonymous' */
  crossOrigin?: 'anonymous' | 'use-credentials' | false
}

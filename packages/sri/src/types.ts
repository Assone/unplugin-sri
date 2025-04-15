export type HashAlgorithm = 'sha256' | 'sha384' | 'sha512'
export type ComputeResourceType = 'script' | 'link'

export interface Options {
  /**
   * Hash algorithm to use for SRI
   * @default 'sha256'
   */
  algorithm?: HashAlgorithm
  /** 需要处理的资源匹配规则 */
  include?: string | RegExp | (string | RegExp)[]
  /** 排除处理的资源匹配规则 */
  exclude?: string | RegExp | (string | RegExp)[]
}

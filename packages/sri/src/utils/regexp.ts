import type { ComputeResourceType, HashAlgorithm } from '../types'

export const RESOURCE_REGEXP = /<(?<tag>link|script)([^>]*) (?:href|src)=["'](?<filepath>[^"']*)["']([^>]*)>/g

export function getReplacementContent(algorithm: HashAlgorithm) {
  return (html: string, fileName: string, digest: string, resourceType: ComputeResourceType) => {
    const attribute = resourceType === 'link' ? 'href' : 'src'

    return html.replace(new RegExp(`<${resourceType}([^>]*)${attribute}=["']/?${fileName}["']([^>]*)>`, 'g'), `<${resourceType}$1${attribute}="${fileName}" integrity="${algorithm}-${digest}"$2>`)
  }
}

export const extractResourceMatches = (html: string): RegExpExecArray[] => Array.from(html.matchAll(RESOURCE_REGEXP))

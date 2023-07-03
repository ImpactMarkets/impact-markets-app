export const ITEMS_PER_PAGE = 30

export const PROJECT_SORT_KEYS = [
  'supportScore',
  'supporterCount',
  'createdAt',
  'actionStart',
  'actionEnd',
  '',
] as const
export type ProjectSortKey = (typeof PROJECT_SORT_KEYS)[number]

export const BOUNTY_SORT_KEYS = ['deadline', 'size', 'createdAt', ''] as const
export type BountySortKey = (typeof BOUNTY_SORT_KEYS)[number]

export const CERTIFICATE_SORT_KEYS = [
  'supporterCount',
  'createdAt',
  'actionStart',
  'actionEnd',
  '',
] as const
export type CertificateSortKey = (typeof CERTIFICATE_SORT_KEYS)[number]

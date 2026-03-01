import type { Category, Priority } from '../lib/database.types'

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'work', label: '仕事' },
  { value: 'private', label: 'プライベート' },
  { value: 'shopping', label: '買い物' },
  { value: 'study', label: '勉強' },
  { value: 'other', label: 'その他' },
]

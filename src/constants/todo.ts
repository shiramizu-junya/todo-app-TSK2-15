import type { Category, Priority, Status } from '../lib/database.types'

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

export const STATUS_OPTIONS: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'not_started', label: '未着手' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' },
]

export const STATUS_LABELS: Record<Status, string> = {
  not_started: '未着手',
  in_progress: '進行中',
  completed: '完了',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  work: '仕事',
  private: 'プライベート',
  shopping: '買い物',
  study: '勉強',
  other: 'その他',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-600',
  low: 'bg-gray-100 text-gray-600',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  work: 'bg-blue-100 text-blue-600',
  private: 'bg-pink-100 text-pink-600',
  shopping: 'bg-green-100 text-green-600',
  study: 'bg-purple-100 text-purple-600',
  other: 'bg-gray-100 text-gray-600',
}

export const STATUS_COLORS: Record<Status, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-600',
  completed: 'bg-green-100 text-green-600',
}

export const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.gif,.webp'

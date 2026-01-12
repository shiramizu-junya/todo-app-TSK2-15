export type TodoType = {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: 'high' | 'medium' | 'low'
  category: 'work' | 'private' | 'shopping' | 'study' | 'other'
  status: 'not_started' | 'in_progress' | 'completed'
  image_url: string | null
  is_deleted: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

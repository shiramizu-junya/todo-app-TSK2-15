import type { Todo } from '../../lib/database.types'

type Props = {
  todo: Todo
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

export const TrashItem = ({ todo, onRestore, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-800 truncate">{todo.title}</h3>
          {todo.deleted_at && (
            <p className="text-xs text-gray-400 mt-1">
              削除日:{' '}
              {new Date(todo.deleted_at).toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onRestore(todo.id)}
            className="px-3 py-1.5 text-sm font-medium border rounded-lg bg-green-50 border-green-300 text-green-600 hover:bg-green-100 transition-colors"
          >
            復元
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-3 py-1.5 text-sm font-medium border rounded-lg bg-red-50 border-red-300 text-red-600 hover:bg-red-100 transition-colors"
          >
            完全削除
          </button>
        </div>
      </div>
    </div>
  )
}

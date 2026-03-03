import { Link } from 'react-router-dom'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../../constants/todo'
import type { Status, Todo } from '../../lib/database.types'

type TodoItemProps = {
  todo: Todo
  onStatusChange: (id: string, status: Status) => void
}

export const TodoItem = ({ todo, onStatusChange }: TodoItemProps) => {
  const truncatedDescription =
    todo.description && todo.description.length > 50
      ? `${todo.description.slice(0, 50)}...`
      : todo.description

  return (
    <Link
      to={`/todos/${todo.id}`}
      className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${PRIORITY_COLORS[todo.priority]}`}
            >
              {PRIORITY_LABELS[todo.priority]}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${CATEGORY_COLORS[todo.category]}`}
            >
              {CATEGORY_LABELS[todo.category]}
            </span>
          </div>

          <h3 className="text-base font-semibold text-gray-800 truncate">{todo.title}</h3>

          {truncatedDescription && (
            <p className="text-sm text-gray-500 mt-1">{truncatedDescription}</p>
          )}

          {(todo.due_date || todo.image_url) && (
            <div className="flex items-center gap-2 mt-2">
              {todo.due_date && (
                <p className="text-xs text-gray-400">
                  期限: {new Date(todo.due_date).toLocaleDateString('ja-JP')}
                </p>
              )}
              {todo.image_url && (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                  />
                </svg>
              )}
            </div>
          )}
        </div>

        <select
          value={todo.status}
          onChange={(e) => {
            e.preventDefault()
            onStatusChange(todo.id, e.target.value as Status)
          }}
          onClick={(e) => e.preventDefault()}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
        >
          {(Object.keys(STATUS_LABELS) as Status[]).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
    </Link>
  )
}

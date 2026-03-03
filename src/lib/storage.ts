import { supabase } from './supabase'

const BUCKET_NAME = 'todo-images'
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return '対応していない画像形式です。JPEG, PNG, GIF, WebP のみ対応しています。'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'ファイルサイズが大きすぎます。5MB以下の画像を選択してください。'
  }
  return null
}

export async function uploadTodoImage(
  file: File,
  userId: string,
  todoId: string
): Promise<{ url: string } | { error: string }> {
  const filePath = `${userId}/${todoId}/${file.name}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    upsert: true,
  })

  if (error) {
    return { error: error.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return { url: publicUrl }
}

export async function deleteTodoImage(imageUrl: string): Promise<{ error: string | null }> {
  const bucketPath = `/storage/v1/object/public/${BUCKET_NAME}/`
  const index = imageUrl.indexOf(bucketPath)
  if (index === -1) {
    return { error: '画像URLの形式が不正です' }
  }
  const filePath = imageUrl.substring(index + bucketPath.length)

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

  return { error: error ? error.message : null }
}

export async function deleteAllTodoImages(
  userId: string,
  todoId: string
): Promise<{ error: string | null }> {
  const folderPath = `${userId}/${todoId}`

  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folderPath)

  if (listError) {
    return { error: listError.message }
  }

  if (!files || files.length === 0) {
    return { error: null }
  }

  const filePaths = files.map((file) => `${folderPath}/${file.name}`)

  const { error: removeError } = await supabase.storage.from(BUCKET_NAME).remove(filePaths)

  return { error: removeError ? removeError.message : null }
}

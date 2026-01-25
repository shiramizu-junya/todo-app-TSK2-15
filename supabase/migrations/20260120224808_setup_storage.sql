-- =============================================
-- Storageバケット設定
-- =============================================

-- バケット作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('todo-images', 'todo-images', FALSE);

-- =============================================
-- Storageポリシー設定
-- =============================================

-- SELECT（閲覧）ポリシー
CREATE POLICY "Users can view own images"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'todo-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- INSERT（アップロード）ポリシー
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'todo-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- DELETE（削除）ポリシー
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'todo-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- バケットをpublicに変更（getPublicUrlでアクセス可能にする）
UPDATE storage.buckets SET public = TRUE WHERE id = 'todo-images';

-- UPDATE（上書き）ポリシー追加（upsert用）
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'todo-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'todo-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

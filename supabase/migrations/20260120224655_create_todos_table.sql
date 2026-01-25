-- =============================================
-- ENUM型作成
-- =============================================

-- 優先度ENUM
CREATE TYPE priority_enum AS ENUM ('high', 'medium', 'low');

-- カテゴリENUM
CREATE TYPE category_enum AS ENUM ('work', 'private', 'shopping', 'study', 'other');

-- ステータスENUM
CREATE TYPE status_enum AS ENUM ('not_started', 'in_progress', 'completed');

-- =============================================
-- todosテーブル作成
-- =============================================

CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL CHECK (title <> ''),
    description TEXT,
    due_date DATE,
    priority priority_enum NOT NULL DEFAULT 'medium',
    category category_enum NOT NULL DEFAULT 'other',
    status status_enum NOT NULL DEFAULT 'not_started',
    image_url VARCHAR(500),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- コメント追加
COMMENT ON TABLE todos IS 'TODOタスク管理テーブル';
COMMENT ON COLUMN todos.id IS 'TODO一意識別子';
COMMENT ON COLUMN todos.user_id IS '所有ユーザーID';
COMMENT ON COLUMN todos.title IS 'タイトル（最大100文字）';
COMMENT ON COLUMN todos.description IS '詳細・メモ';
COMMENT ON COLUMN todos.due_date IS '期限日';
COMMENT ON COLUMN todos.priority IS '優先度（high/medium/low）';
COMMENT ON COLUMN todos.category IS 'カテゴリ（work/private/shopping/study/other）';
COMMENT ON COLUMN todos.status IS 'ステータス（not_started/in_progress/completed）';
COMMENT ON COLUMN todos.image_url IS '添付画像URL';
COMMENT ON COLUMN todos.is_deleted IS '削除フラグ（TRUE=ゴミ箱）';
COMMENT ON COLUMN todos.deleted_at IS 'ゴミ箱移動日時';
COMMENT ON COLUMN todos.created_at IS '作成日時';
COMMENT ON COLUMN todos.updated_at IS '更新日時';

-- =============================================
-- インデックス作成
-- =============================================

-- ユーザー別検索用インデックス
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- 一覧表示用複合インデックス（ユーザー + 削除フラグ + ステータス）
CREATE INDEX idx_todos_user_status ON todos(user_id, is_deleted, status);

-- ゴミ箱表示用インデックス
CREATE INDEX idx_todos_user_deleted ON todos(user_id, is_deleted) WHERE is_deleted = TRUE;

-- =============================================
-- updated_at自動更新トリガー
-- =============================================

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- todosテーブルにトリガー適用
CREATE TRIGGER trigger_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLSポリシー設定
-- =============================================

-- RLS有効化
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- SELECTポリシー：自分のTODOのみ閲覧可能
CREATE POLICY todos_select_policy ON todos
    FOR SELECT
    USING (auth.uid() = user_id);

-- INSERTポリシー：自分のTODOのみ作成可能
CREATE POLICY todos_insert_policy ON todos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATEポリシー：自分のTODOのみ更新可能
CREATE POLICY todos_update_policy ON todos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETEポリシー：自分のTODOのみ削除可能
CREATE POLICY todos_delete_policy ON todos
    FOR DELETE
    USING (auth.uid() = user_id);

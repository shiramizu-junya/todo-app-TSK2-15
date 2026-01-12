# CLAUDE.md

このファイルはClaude Codeがプロジェクトを理解するためのガイドです。

## プロジェクト概要

個人向けTODOアプリケーション（MVP）

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **スタイリング**: TailwindCSS
- **バックエンド**: Supabase（認証・データベース・ストレージ）
- **ホスティング**: Vercel

## ドキュメント

- `doc/requirements.md` - 要件定義書
- `doc/screen-design.md` - 画面設計書
- `doc/database-design.md` - データベース設計書
- `doc/directory-structure.md` - ディレクトリ構成
- `doc/wireframes.html` - ワイヤーフレーム

## 主要コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run lint         # ESLintチェック
npm run lint:fix     # ESLint自動修正
npm run format       # Prettierフォーマット
```

## データモデル

### Todo

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | UUID | 主キー |
| user_id | UUID | ユーザーID |
| title | string | タイトル（最大100文字） |
| description | string? | 詳細・メモ |
| due_date | date? | 期限 |
| priority | 'high' \| 'medium' \| 'low' | 優先度 |
| category | 'work' \| 'private' \| 'shopping' \| 'study' \| 'other' | カテゴリ |
| status | 'not_started' \| 'in_progress' \| 'completed' | ステータス |
| image_url | string? | 添付画像URL |
| is_deleted | boolean | 削除フラグ |
| deleted_at | timestamp? | 削除日時 |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

## 画面一覧

| パス | 画面 | 認証 |
|------|------|------|
| /login | ログイン | 不要 |
| /signup | 新規登録 | 不要 |
| /reset-password | パスワードリセット | 不要 |
| / | TODO一覧 | 必要 |
| /todos/new | TODO作成 | 必要 |
| /todos/:id | TODO詳細 | 必要 |
| /todos/:id/edit | TODO編集 | 必要 |
| /trash | ゴミ箱 | 必要 |

## 環境変数

```
VITE_SUPABASE_URL=Supabase URL
VITE_SUPABASE_ANON_KEY=Supabase Anon Key
```

# TODO App

個人のタスク管理を効率化するための Web アプリケーション（MVP）。

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | React + TypeScript + Vite |
| スタイリング | TailwindCSS |
| バックエンド | Supabase（認証・データベース・Storage） |
| ホスティング | Vercel |

## 主な機能

- **認証**: メール/パスワードによるユーザー登録・ログイン・パスワードリセット
- **TODO管理**: 作成・一覧表示・詳細表示・編集・削除（論理削除）
- **ステータス管理**: 未着手 / 進行中 / 完了
- **分類**: 優先度（高・中・低）、カテゴリ（仕事・プライベート・買い物・勉強・その他）
- **画像添付**: TODO に画像をアップロード・プレビュー・削除
- **検索・フィルタ**: キーワード検索、ステータスフィルタリング（デバウンス対応）
- **ゴミ箱**: 削除した TODO の復元・完全削除（Storage 画像も連動削除）

## セットアップ

### 前提条件

- Node.js
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 環境変数

`.env` ファイルをプロジェクトルートに作成してください。

```
VITE_SUPABASE_URL=<Supabase URL>
VITE_SUPABASE_ANON_KEY=<Supabase Anon Key>
```

### ローカル開発

```bash
# 依存パッケージのインストール
npm install

# Supabase ローカル環境の起動
npx supabase start

# 開発サーバーの起動
npm run dev
```

### その他コマンド

```bash
npm run build        # プロダクションビルド
npm run lint         # ESLint チェック
npm run lint:fix     # ESLint 自動修正
npm run format       # Prettier フォーマット
```

## ドキュメント

- [要件定義書](doc/requirements.md)
- [画面設計書](doc/screen-design.md)
- [データベース設計書](doc/database-design.md)
- [ディレクトリ構成](doc/directory-structure.md)
- [ワイヤーフレーム](doc/wireframes.html)

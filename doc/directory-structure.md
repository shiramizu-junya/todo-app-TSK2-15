# TODOアプリケーション ディレクトリ構成

## 概要

React + TypeScript + Supabaseを使用したTODOアプリケーションのディレクトリ構成。

## ディレクトリ構成

```
todo-app-TSK2-15/
├── doc/                          # ドキュメント
│   ├── requirements.md           # 要件定義書
│   ├── screen-design.md          # 画面設計書
│   ├── database-design.md        # データベース設計書
│   ├── directory-structure.md    # ディレクトリ構成（本ファイル）
│   └── wireframes.html           # ワイヤーフレーム
│
├── src/
│   ├── components/               # コンポーネント
│   │   ├── ui/                   # 汎用UIコンポーネント
│   │   │   ├── Button.tsx        # ボタン（プライマリ/セカンダリ/デンジャー）
│   │   │   ├── Input.tsx         # テキスト入力
│   │   │   ├── Textarea.tsx      # テキストエリア
│   │   │   ├── Select.tsx        # セレクトボックス
│   │   │   ├── DatePicker.tsx    # 日付ピッカー
│   │   │   ├── Badge.tsx         # バッジ（優先度/カテゴリ/ステータス）
│   │   │   ├── Modal.tsx         # モーダルダイアログ
│   │   │   ├── Spinner.tsx       # ローディングスピナー
│   │   │   ├── Toast.tsx         # トースト通知
│   │   │   ├── FileUpload.tsx    # ファイルアップロード
│   │   │   └── EmptyState.tsx    # 空状態表示
│   │   │
│   │   ├── layout/               # レイアウトコンポーネント
│   │   │   └── Header.tsx        # ヘッダー（タイトル/ゴミ箱/ログアウト）
│   │   │
│   │   └── todo/                 # TODO関連コンポーネント
│   │       ├── TodoCard.tsx      # TODOカード（一覧表示用）
│   │       ├── TodoForm.tsx      # TODOフォーム（作成/編集共用）
│   │       ├── TodoList.tsx      # TODOリスト
│   │       ├── TodoFilter.tsx    # フィルター・検索バー
│   │       └── TrashItem.tsx     # ゴミ箱アイテム
│   │
│   ├── pages/                    # ページコンポーネント
│   │   ├── LoginPage.tsx         # SCR-001: ログイン画面 /login
│   │   ├── SignupPage.tsx        # SCR-002: 新規登録画面 /signup
│   │   ├── ResetPasswordPage.tsx # SCR-003: パスワードリセット画面 /reset-password
│   │   ├── TodoListPage.tsx      # SCR-004: TODO一覧画面 /
│   │   ├── TodoCreatePage.tsx    # SCR-005: TODO作成画面 /todos/new
│   │   ├── TodoDetailPage.tsx    # SCR-006: TODO詳細画面 /todos/:id
│   │   ├── TodoEditPage.tsx      # SCR-007: TODO編集画面 /todos/:id/edit
│   │   └── TrashPage.tsx         # SCR-008: ゴミ箱画面 /trash
│   │
│   ├── hooks/                    # カスタムフック
│   │   ├── useAuth.ts            # 認証関連フック
│   │   ├── useTodos.ts           # TODO CRUD操作フック
│   │   └── useToast.ts           # トースト通知フック
│   │
│   ├── contexts/                 # React Context
│   │   └── AuthContext.tsx       # 認証状態管理
│   │
│   ├── lib/                      # ライブラリ・外部サービス連携
│   │   ├── supabase.ts           # Supabaseクライアント
│   │   └── database.types.ts     # Supabase型定義
│   │
│   ├── types/                    # 型定義
│   │   └── index.ts              # アプリ共通の型定義
│   │
│   ├── utils/                    # ユーティリティ関数
│   │   ├── format.ts             # 日付フォーマット等
│   │   └── validation.ts         # バリデーション関数
│   │
│   ├── constants/                # 定数定義
│   │   └── index.ts              # 優先度/カテゴリ/ステータス定義
│   │
│   ├── App.tsx                   # ルートコンポーネント（ルーティング）
│   ├── main.tsx                  # エントリーポイント
│   └── index.css                 # グローバルスタイル（Tailwind）
│
├── public/                       # 静的ファイル
├── .env                          # 環境変数（Git管理外）
├── .env.example                  # 環境変数テンプレート
├── .gitignore
├── .prettierrc                   # Prettier設定
├── eslint.config.js              # ESLint設定
├── index.html
├── package.json
├── tailwind.config.js            # TailwindCSS設定
├── tsconfig.json
└── vite.config.ts                # Vite設定
```

## 各ディレクトリの責務

| ディレクトリ | 責務 | 例 |
|-------------|------|-----|
| `components/ui/` | 再利用可能な汎用UIコンポーネント | Button, Input, Badge |
| `components/layout/` | ページレイアウトを構成するコンポーネント | Header |
| `components/todo/` | TODO機能に特化したコンポーネント | TodoCard, TodoForm |
| `pages/` | ルーティングに対応する画面単位のコンポーネント | LoginPage, TodoListPage |
| `hooks/` | 状態管理・データ取得ロジックの再利用 | useAuth, useTodos |
| `contexts/` | グローバルな状態管理 | AuthContext |
| `lib/` | 外部サービスとの連携設定 | Supabaseクライアント |
| `types/` | TypeScript型定義 | Todo, User |
| `utils/` | 汎用的なユーティリティ関数 | formatDate |
| `constants/` | アプリ全体で使用する定数 | PRIORITY, CATEGORY, STATUS |

## ファイル命名規則

| 種類 | 命名規則 | 例 |
|------|----------|-----|
| コンポーネント | PascalCase | `TodoCard.tsx` |
| フック | camelCase（use接頭辞） | `useTodos.ts` |
| ユーティリティ | camelCase | `format.ts` |
| 型定義 | PascalCase | `Todo`, `User` |
| 定数 | UPPER_SNAKE_CASE | `PRIORITY`, `STATUS` |

## 画面とルーティングの対応

| 画面ID | ページコンポーネント | パス | 認証 |
|--------|---------------------|------|------|
| SCR-001 | `LoginPage.tsx` | `/login` | 不要 |
| SCR-002 | `SignupPage.tsx` | `/signup` | 不要 |
| SCR-003 | `ResetPasswordPage.tsx` | `/reset-password` | 不要 |
| SCR-004 | `TodoListPage.tsx` | `/` | 必要 |
| SCR-005 | `TodoCreatePage.tsx` | `/todos/new` | 必要 |
| SCR-006 | `TodoDetailPage.tsx` | `/todos/:id` | 必要 |
| SCR-007 | `TodoEditPage.tsx` | `/todos/:id/edit` | 必要 |
| SCR-008 | `TrashPage.tsx` | `/trash` | 必要 |

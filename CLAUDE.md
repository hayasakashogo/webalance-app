# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

WeBalanceはカップル向け家計管理アプリ。Next.js 16 (App Router) + Supabase + TypeScript で構築。リアルタイムで共有支出を管理でき、モバイルファーストデザイン（max-width 430px）。

## よく使うコマンド

- `npm run dev` — 開発サーバー起動（Turbopack）
- `npm run build` — 本番ビルド
- `npm run lint` — ESLint実行
- テストフレームワークは未導入

## 技術スタック

- **フレームワーク:** Next.js 16（App Router, Turbopack, React 18）
- **言語:** TypeScript（strict mode、パスエイリアス `@/*`）
- **スタイリング:** Tailwind CSS（カスタムテーマカラー: primary #07B4BA, secondary #F17C55）
- **UIコンポーネント:** shadcn/ui（New Yorkスタイル、RSC対応）`components/ui/`
- **バックエンド/認証:** Supabase（PostgreSQL、Email OTP認証、Realtimeサブスクリプション）
- **フォーム:** React Hook Form + Zodバリデーション
- **アニメーション:** Framer Motionによるページトランジション
- **アイコン:** lucide-react, react-icons
- **トースト通知:** react-hot-toast（shadcn toastではない）

## アーキテクチャ

### ルートグループ

```
app/
  (app)/    — メインのカップルダッシュボード・支出管理（認証必須）
  (form)/   — 認証フォーム: signin, signup, setup, password-reset
  (home)/   — ランディングページ
  (other)/  — 利用規約、プライバシーポリシー
  auth/     — 認証コールバック（OTP検証）
```

### 動的ルート

カップル固有のページは `[coupleId]/[yearMonth]` セグメントで月別の支出を表示。

### 状態管理

2つのReact ContextがSupabase Realtimeと同期してアプリケーション状態を管理:

- **CoupleContext** (`app/(app)/app/_components/couple-provider.tsx`) — 現在のユーザー、パートナー、カップル情報
- **ExpensesContext** (`app/(app)/app/_components/expenses-provider.tsx`) — 支出データのリアルタイムINSERT/UPDATE/DELETEリスナー

Server Componentがレイアウトで初期データを取得し、Context Providerに渡す。Client Componentがリアルタイム更新をサブスクライブする。

### Supabaseの構成

- クライアントファクトリ: `utils/supabase/client.ts`（ブラウザ用）、`utils/supabase/server.ts`（サーバー用）
- サーバーヘルパー: `lib/supabese/`（ディレクトリ名にtypoあり）
- テーブル: `users`, `couples`, `expenses`
- ストレージバケット: `user-icons`, `couple-images`
- リモート画像は `next.config.ts` でSupabase CDN向けに設定済み

### 認証フロー

Email OTP → `/auth/callback` or `/auth/confirm` → Supabase SSRでセッション作成 → レイアウトでセッションチェック

## コーディング規約

- gitブランチ名・コミットメッセージは日本語（例: `feature/スケルトンUI実装`）
- Server Componentはレイアウトとデータ取得に使用、Client Component（`'use client'`）はインタラクティブな機能に使用
- Supabaseクライアントのインポート: `@/utils/supabase/client`（ブラウザ）、`@/utils/supabase/server`（サーバー）
- shadcn/uiコンポーネントは `@/components/ui/` からインポート
- カスタムカラーパレットは `lib/colors/colors.ts` で定義

## 環境変数

`.env.local` に以下を設定:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

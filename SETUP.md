# BackBone LP — 環境・設定書

最終更新: 2026-06-02

---

## 1. 本番環境情報

| 項目 | 値 |
|---|---|
| 本番URL | https://backbone-lp.vercel.app |
| GitHub リポジトリ | https://github.com/tlbcbbrc-code/backbone-lp |
| Vercel プロジェクト | backbone-lp |
| デプロイブランチ | main |
| デプロイ方式 | GitHub push → Vercel 自動デプロイ |

---

## 2. 必要なID・トークン一覧

### 設定済み

| 項目 | 値 | 場所 |
|---|---|---|
| LINE 公式アカウントID | @710sifho | index.html, liff.html |
| LINE トーク URL | https://line.me/R/ti/p/@710sifho | index.html |

### 設定待ち

| 変数名 | 説明 | 設定場所 |
|---|---|---|
| `LIFF_ID` | LIFF アプリID（例: `1234567890-AbCdEfGh`） | index.html 816行目・liff.html 188行目 |
| `LINE_CHANNEL_ACCESS_TOKEN` | Messaging API チャンネルアクセストークン（長期） | Vercel 環境変数 |
| `LINE_ADMIN_USER_ID` | 予約通知を受け取る管理者の LINE User ID | Vercel 環境変数 |

---

## 3. LIFFセットアップ手順

### STEP 1: LINE Developers にログイン

https://developers.line.biz/ へアクセス → 右上「ログイン」→ LINE アカウントでログイン

---

### STEP 2: プロバイダーを作成（未作成の場合）

コンソールトップ →「プロバイダーを作成」→ 名前: `BackBone`

---

### STEP 3: LINE Login チャンネルを作成（LIFF用）

1. 作成したプロバイダー →「チャンネル作成」→「LINE Login」を選択
2. 以下を入力:
   - チャンネル名: `BackBone LIFF`
   - アプリタイプ: ウェブアプリ
3. 作成後「LIFF」タブ →「LIFFアプリを追加」
   - LIFFアプリ名: `BackBone 予約`
   - サイズ: `Full`
   - エンドポイントURL: `https://backbone-lp.vercel.app/liff.html`
   - Scope: `profile`（任意）
4. **発行された LIFF ID をメモ**（例: `1234567890-AbCdEfGh`）

---

### STEP 4: LIFF ID をコードに埋め込む

**index.html 816行目:**
```javascript
// 変更前
const LIFF_ID = 'YOUR_LIFF_ID';

// 変更後（例）
const LIFF_ID = '1234567890-AbCdEfGh';
```

**liff.html 188行目:**
```javascript
// 変更前
const LIFF_ID = 'YOUR_LIFF_ID';

// 変更後（同じ値）
const LIFF_ID = '1234567890-AbCdEfGh';
```

変更後、`git add . && git commit -m "設定: LIFF ID を設定" && git push` を実行

---

### STEP 5: Messaging API チャンネルアクセストークンを取得

1. LINE Developers Console → @710sifho のプロバイダー →「Messaging API」チャンネルを選択
2.「Messaging API設定」タブ →「チャンネルアクセストークン（長期）」→「発行」
3. **表示されたトークンをメモ**（再表示不可のため必ずコピー）

---

### STEP 6: 管理者の LINE User ID を確認

LINE Developers Console にログインした状態で右上のアイコンをクリック  
→「あなたのユーザーID: Uxxxxxxxxxxxxxxxxx」をメモ

---

### STEP 7: Vercel に環境変数を設定

1. https://vercel.com → backbone-lp プロジェクト → Settings → Environment Variables
2. 以下を追加（Environment: Production / Preview / Development すべてにチェック）:

| Name | Value |
|---|---|
| `LINE_CHANNEL_ACCESS_TOKEN` | STEP5 で取得したトークン |
| `LINE_ADMIN_USER_ID` | STEP6 で確認した User ID（`Uxxxxxxxxx` 形式） |

3. 追加後「Save」→ プロジェクトトップ → 最新デプロイ → 「...」→「Redeploy」

---

### STEP 8: 動作確認

1. スマートフォンの LINE アプリで以下の URL を開く:
   ```
   https://liff.line.me/{LIFF_ID}?n=テスト&d1=6月15日(月)午後&sy=腰痛
   ```
2. 予約確認画面が表示されることを確認
3. 「送信」ボタンをタップ
4. 管理者の LINE に予約通知が届くことを確認

---

## 4. 将来実装の追加設定

### Google Sheets 連携

追加で必要な環境変数:

| Name | 説明 |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | GCPサービスアカウントのJSON（Base64エンコード） |
| `GOOGLE_SHEET_ID` | 集計用スプレッドシートのID（URLの `/d/` と `/edit` の間の文字列） |

### Notion 連携

追加で必要な環境変数:

| Name | 説明 |
|---|---|
| `NOTION_API_KEY` | Notion Integration のシークレットキー |
| `NOTION_DATABASE_ID` | 紹介者管理データベースのID |

---

## 5. ローカル起動方法

### フロントエンドのみ（HTML/CSS/JS の確認）

```bash
cd /Users/yamazakikatsurashirou/Desktop/backbone-lp
python3 -m http.server 8734
# → http://localhost:8734 で確認
# → http://localhost:8734/liff-mock.html でLIFFモックを確認
```

> ⚠️ `api/` のサーバーレス関数（notify.js）はローカルでは動作しません。

### API を含めたローカル確認（Vercel CLI）

```bash
npm install -g vercel
vercel dev
# → http://localhost:3000 で確認（API Routes も動作）
```

初回は `vercel login` と `vercel link` が必要です。

---

## 6. デプロイ方法

```bash
# 通常のデプロイ（pushで自動）
git add .
git commit -m "変更内容"
git push origin main
# → GitHub Webhook → Vercel が自動でビルド・デプロイ

# デプロイ状況の確認
# Vercel ダッシュボード → backbone-lp → Deployments
```

---

## 7. 参照リンク

| サービス | URL |
|---|---|
| LINE Developers Console | https://developers.line.biz/console/ |
| LINE Messaging API リファレンス | https://developers.line.biz/ja/reference/messaging-api/ |
| LIFF ドキュメント | https://developers.line.biz/ja/docs/liff/ |
| Vercel ダッシュボード | https://vercel.com/dashboard |
| GitHub リポジトリ | https://github.com/tlbcbbrc-code/backbone-lp |
| Google Sheets API | https://developers.google.com/sheets/api |
| Notion API | https://developers.notion.com/ |

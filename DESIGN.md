# BackBone LP — 設計書

最終更新: 2026-06-02

---

## 1. 画面構成・セクション一覧

| # | セクション | ID/クラス | 概要 |
|---|---|---|---|
| 1 | ヒーロー | `#hero` | 封筒アニメーション・ギフトカード落下・招待ボックス |
| 2 | セルフチェック | `.check-sec` | 症状選択・骨格図ハイライト・参考レポート |
| 3 | クリニック紹介 | `.about-sec` | 特徴カード・一般施術院との比較表・効果リスト |
| 4 | お問い合わせ | `#cta` | 予約フォーム・LINEボタン |
| 5 | FAQ | `.faq-sec` | アコーディオン形式 5問 |
| 6 | アクセス | `.access-sec` | 住所・最寄駅・電話・Webサイト |
| - | フッター | `footer` | ロゴ・免責事項 |

---

## 2. ヒーローセクション 詳細

### アニメーション状態遷移

```
[初期状態]
  見出し (THE LATEST BONE CURE / 最先端骨格矯正 / BACKBONE)
  封筒（閉じた状態・Bシールあり）
  "Tap to open" ヒント

        ↓ ユーザーがタップ

[開封アニメーション 0〜0.9s]
  フラップが上方向にrotateX(180deg)
  シールがフェードアウト
  見出しが非表示に

        ↓ 700ms後

[ギフトカード落下 0.78s]
  .gift-card に .drop クラスを付与
  gcDrop アニメーション: translateY(-130px) → 0

        ↓ 600ms後（合計1.3s）

[招待ボックス表示]
  #invBox フェードイン
  「大切な方への、特別なご案内」テキスト
  スクロールを促すキュー
```

### ギフトカード仕様
- サイズ: `min(272px, 80vw)`
- 背景: ダークネイビー radial-gradient + linear-gradient
- ロゴ: goldShimmer アニメーション（4.5s linear infinite）
- 要素: PRIVATE INVITATION / BACKBONE / 初回カウンセリング 無料ご招待 / 完全紹介制・骨格矯正専門院

---

## 3. デザインシステム

### カラーパレット

```css
:root {
  /* ブランドカラー */
  --red:       #8B0026;   /* バーガンディ（メインカラー） */
  --red-d:     #6A001C;   /* バーガンディ 濃 */
  --red-l:     #B8003A;   /* バーガンディ 淡 */
  --red-pale:  #FDF1F4;   /* バーガンディ 背景 */
  --red-border:#F2C4CF;   /* バーガンディ ボーダー */

  --gold:      #B8924A;   /* ゴールド */
  --gold-l:    #D4AA6A;   /* ゴールド 淡 */

  --navy:      #1A2438;   /* ネイビー */
  --navy-l:    #2A3A58;   /* ネイビー 淡 */

  /* ニュートラル */
  --gray-d:    #2E2E2E;
  --gray:      #5A5A5A;
  --gray-l:    #8A8A8A;
  --line:      #E6E6E6;
  --bg:        #FFFFFF;
  --bg-s:      #F7F6F4;
  --bg-m:      #F0EDE8;

  /* LINE グリーン */
  --green:     #06C755;
}
```

### フォント

| 用途 | フォント | ウェイト |
|---|---|---|
| 英字装飾・見出し | Cormorant Garamond | 300, 400, italic |
| 日本語本文 | Noto Sans JP | 300, 400, 500 |
| 日本語見出し | Noto Serif JP | 300, 400, 500 |

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Noto+Sans+JP:wght@300;400;500&family=Noto+Serif+JP:wght@300;400;500&display=swap" rel="stylesheet">
```

### レイアウト

```css
body    { max-width: 430px; margin: 0 auto; }  /* スマホ最大幅 */
.sec    { padding: 88px 26px; }                 /* セクション共通 */
```

### タイポグラフィスケール

| クラス | サイズ | 用途 |
|---|---|---|
| `.sec-ttl` | `clamp(22px, 1.75rem, 34px)` | セクション見出し |
| `.sec-body` | `0.875rem` | セクション本文 |
| `.eyebrow` | `10px` | 英字小見出し |
| `.form-in` | `0.9375rem` | フォーム入力 |
| `.line-btn` | `0.9375rem` | LINEボタン |
| `.faq-q` | `0.875rem` | FAQ質問 |

---

## 4. セルフチェック機能 詳細

### 症状データ（SYMS配列）

```javascript
[
  { id:"back",      name:"腰痛",          area:"腰椎・骨盤",      sites:["lumbar","pelvis"] },
  { id:"shoulder",  name:"肩こり・首こり", area:"頸椎・胸椎",      sites:["cspine","thoracic"] },
  { id:"head",      name:"頭痛",           area:"頸椎（上位）",    sites:["c1c2","cspine"] },
  { id:"numb-hand", name:"手・腕のしびれ", area:"頸椎・上肢神経",  sites:["c1c2","cspine","nerve"] },
  { id:"numb-foot", name:"足・脚のしびれ", area:"腰椎・坐骨神経",  sites:["lumbar","pelvis","nerve"] },
  { id:"posture",   name:"姿勢の歪み",     area:"脊椎・骨盤全体",  sites:["cspine","thoracic","lumbar","pelvis"] },
  { id:"hip",       name:"股関節痛",       area:"骨盤・股関節",    sites:["pelvis"] },
  { id:"other",     name:"その他",         area:"総合",            sites:[] },
]
```

### 骨格図ハイライト部位

| ID | 表示名 | 対応部位 |
|---|---|---|
| c1c2 | C1/C2 | 頸椎上位 |
| cspine | C3–C7 | 頸椎 |
| thoracic | T5–T9 | 胸椎 |
| lumbar | L1–L5 | 腰椎 |
| pelvis | Pelvis | 骨盤 |
| nerve | Nerve | 神経路（紫色の破線） |

---

## 5. データフロー図

### 現在の実装（LIFF設定待ち）

```
[患者] LP を開く
    │
    ├─ 症状を選択 → 骨格図ハイライト（クライアントサイドのみ）
    │
    └─ フォーム入力 → LINEボタンをタップ
             │
             ▼
      バリデーション（氏名・第一希望日 必須）
             │
             ▼
      URLパラメータを組み立て
      ?n=名前&d1=第一希望&d2=第二希望&sy=症状
             │
             ▼
      https://liff.line.me/{LIFF_ID}?... を開く
             │
             ▼（LINE アプリ内ブラウザで開く）
      [liff.html] 入力内容を確認表示
             │
             ▼ 送信ボタンをタップ
      POST /api/notify
      { name, d1, d2, sy }
             │
             ▼
      [api/notify.js] Vercel サーバーレス関数
             │
             ▼
      LINE Messaging API（push）
             │
             ▼
      [クリニック管理者] LINE に予約通知が届く
```

### 将来実装（?ref= 対応後）

```
[紹介者] 固有URL https://backbone-lp.vercel.app/?ref=REFERRER_ID を共有
             │
             ▼
[患者] LP を開く → ref パラメータを localStorage に保存
             │
             ▼（フォーム送信後）
      POST /api/notify
      { name, d1, d2, sy, ref: "REFERRER_ID" }
             │
             ├─▶ LINE Messaging API → 管理者に通知（紹介者名付き）
             │
             └─▶ Google Sheets API → 紹介実績に1行追記
                  [ 日時 | 紹介者ID | 患者名 | 希望日 | 症状 ]
                             │
             ┌───────────────┘
             ▼
      Notion DB の紹介者レコードの紹介件数 +1
```

---

## 6. URLパラメータ仕様

### LIFFへの引き渡しパラメータ（実装済み）

| パラメータ | 型 | 説明 | 例 |
|---|---|---|---|
| `n` | string | 患者氏名 | `田中花子` |
| `d1` | string | 第一希望日テキスト | `6月15日(月) 午後` |
| `d2` | string | 第二希望日テキスト（任意） | `6月17日(水) 午前` |
| `sy` | string | 症状（中点区切り、任意） | `腰痛・肩こり` |

### 紹介者識別パラメータ（未実装）

| パラメータ | 型 | 説明 | 例 |
|---|---|---|---|
| `ref` | string | 紹介者の固有ID | `yamamoto_k` |

**URLの例:**
```
https://backbone-lp.vercel.app/?ref=yamamoto_k
```

**設計方針:**
- IDは英数字・アンダースコアのみ使用（例: `yamada_t`, `suzuki_h`）
- Notionで「ID → 氏名」のマスタを管理
- 存在しない ref はapi側でスキップ（エラーにしない）

---

## 7. ファイル別技術詳細

### index.html
- HTML/CSS/JS を1ファイルに完結（フレームワーク不使用）
- CSS: `<style>` タグ内（約420行）
- JS: `<script>` タグ内（約200行）
- 主要な状態: `const sel = new Set()` で選択症状を管理

### liff.html
- LIFF SDK v2 を使用（`https://static.line-scdn.net/liff/edge/2/sdk.js`）
- URLパラメータを `URLSearchParams` でパース
- `/api/notify` へ `fetch` で POST
- `liff.closeWindow()` で LINE 内ブラウザを閉じる

### api/notify.js
- Vercel Serverless Function（Node.js、ESM形式 `export default`）
- LINE Messaging API の `/v2/bot/message/push` エンドポイントを使用
- 環境変数: `LINE_CHANNEL_ACCESS_TOKEN` / `LINE_ADMIN_USER_ID`

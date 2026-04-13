# Apparel Marketing Analytics Dashboard (Demo)

アパレル業界向けマーケティング分析ツールのデモ画面です。

## 概要

売上実績・ユーザー特性・施策スケジュール・媒体別パフォーマンスを一元的に可視化する全5ページのダッシュボードです。Chart.js によるビジュアライゼーションと、ガントチャート風の施策カレンダー、自動分析コメントを備えています。

## ページ構成

| # | ページ | 内容 |
|---|---|---|
| 1 | `marketing.html` | 売上KPI（全体売上・件数・点数・平均購入金額・プロパー/セール比率）・ユーザー特性（男女比・年齢・都道府県）・LTV |
| 2 | `marketing-overall.html` | 全体施策スケジュール / 全体セッション・UU・CVR / 媒体別内訳 |
| 3 | `marketing-ads.html` | 広告施策スケジュール / 広告媒体別セッション・UU・CVR（Google・Yahoo!・Meta・LINE・Criteo・TikTok） |
| 4 | `marketing-sns.html` | SNS施策スケジュール / SNS媒体別セッション・UU・CVR（Instagram・X・TikTok・YouTube・LINE公式・Pinterest） |
| 5 | `marketing-crm.html` | CRM施策スケジュール / メルマガ・LINE・アプリプッシュ・Webプッシュ・SMSの配信効果 |

## 特徴

- 全ページに **分析コメント・改善ポイント** を自動表示（好調 / 要改善 / 要注意 のタグ付き）
- **ガントチャート風**の施策スケジュールUI
- 前月比・前年比の **KPI差分表示**
- 静的HTMLのみで動作（ビルド不要）

## 技術スタック

- HTML / CSS / JavaScript（バニラ）
- [Chart.js](https://www.chartjs.org/) — グラフ描画
- [Ionicons](https://ionic.io/ionicons) — アイコン
- Google Fonts（Inter / Noto Sans JP）

## ローカルで確認する

```bash
git clone https://github.com/miku19940/marketing-dashboard-demo.git
cd marketing-dashboard-demo
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080/` を開いてください。

## デプロイ

Vercel / Netlify / Cloudflare Pages など、任意の静的ホスティングサービスに対応しています。ビルド設定は不要です。

## ライセンス

Private / Demo Use Only

---

© Apparel Marketing Analytics Demo

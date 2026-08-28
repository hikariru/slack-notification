# slack-notification

Cloudflare Workers上で動作する個人用Slack通知Bot。

## 機能

* `/ping` スラッシュコマンド
* `app_mention` イベントへの応答
* Cron Triggers経由で室温・湿度（Nature Remo）と天気予報（気象庁データ）をSlackへ定期投稿

## 開発

```bash
bun install
cp .dev.vars.example .dev.vars  # 値を埋める
bun run dev                     # wrangler dev
```

## デプロイ

```bash
wrangler secret put SLACK_BOT_TOKEN
wrangler secret put SLACK_SIGNING_SECRET
wrangler secret put NATURE_REMO_TOKEN
wrangler secret put GENERAL_CHANNEL_ID
wrangler secret put WEATHER_CHANNEL_ID
bun run deploy
```

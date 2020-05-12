# slack-notification

running on Heroku

## endpoint: `/slack/remo_status`

* Heroku Scheduler経由で1時間ごとにcurlで叩く。Slackの特定チャンネルにNature Remoの気温を投稿する

## command: `/remo`

* Nature Remoの気温を返す

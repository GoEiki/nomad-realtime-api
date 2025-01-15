package.jsonの"scripts"
"ssl": "nuxt dev --https --ssl-cert ./10.0.1.56.pem --ssl-key ./10.0.1.56-key.pem --host 0.0.0.0 --port 3000",
自分のIPアドレスの証明書を発行して追加してください。
上記の"ssl"の該当部分のパスを変更してください。
※ローカルネットワーク内のみの動作しかできません。

実行コマンド
npm run ssl



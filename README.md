package.jsonの"scripts"
"ssl": "nuxt dev --https --ssl-cert ./10.0.1.56.pem --ssl-key ./10.0.1.56-key.pem --host 0.0.0.0 --port 3000",
自分のIPアドレスの証明書を発行して追加してください。
上記の"ssl"の該当部分のパスを変更してください。
※ローカルネットワーク内のみの動作しかできません。

実行コマンド
npm run ssl

componentsの各vueファイルの
function setClient() {
  clientRef.value = new RealtimeClient({ 
    url: 'wss://10.0.1.56:3000/relay?id=user123&role=console'
  });
urlのIPアドレスを自分のIPアドレスに置き換えてください

環境変数
OPENAI_API_KEYを設定してください

# NOMADシステム
## インストール方法
### プログラムのインストール
```
git install https://github.com/tamiyaayumu/nomad-realtime-api
```
### 自己署名証明書の発行

### OpenAIのAPIキー
環境変数としてOPENAI_API_KEYを作成する
### 設定ファイルへの書き込み
package.jsonの"scripts"
"ssl": "nuxt dev --https --ssl-cert ./10.0.1.56.pem --ssl-key ./10.0.1.56-key.pem --host 0.0.0.0 --port 3000",
自分のIPアドレスの証明書を発行して追加してください。
上記の"ssl"の該当部分のパスを変更してください。
※ローカルネットワーク内のみの動作しかできません。

nomadconfig.jsonのIPアドレスを設定

## 実行
```
npm run ssl
```
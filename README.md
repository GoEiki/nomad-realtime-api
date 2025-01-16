# NOMADシステム
## インストール方法
### プログラムのインストール
```
git install https://github.com/tamiyaayumu/nomad-realtime-api
```
### 自己署名証明書の発行

### OpenAIのAPIキー
環境変数としてOPENAI_API_KEYを設定する  
zshの場合  
yourkeyを自分のAPIキーに置き換える  
```
echo "export OPENAI_API_KEY='yourkey'" >> ~/.zshrc
```
シェルを更新する
```
source ~/.zshrc
```
### 設定ファイルへの書き込み
package.jsonの下記部分に証明書と鍵のパスを記載
```
"ssl": "nuxt dev --https --ssl-cert <enter cerfiticate file path> --ssl-key <enter key path> --host 0.0.0.0 --port 3000",
```

nomadconfig.jsonの下記部分にIPアドレスを記載
```
{
    "IPadress": <enter your IP adress>
}
```
※ローカルネットワーク内のみの動作しかできません。

## 実行
```
npm run ssl
```
# NOMADシステム
## インストール方法
git, Node.js, opensslがインストールされていること
### プログラムのインストール
```
git clone https://github.com/tamiyaayumu/nomad-realtime-api
```
### 自己署名証明書の発行
1. 秘密鍵の生成
```
openssl genrsa 2048 > nomad.key
```
2. 自己署名証明書の発行
```
openssl req -new -x509 -days 3650 -key nomad.key -sha512 -out nomad.crt
```
### OpenAIのAPIキー
環境変数としてOPENAI_API_KEYを設定する  
**zshの場合**  
yourkeyを自分のAPIキーに置き換える  
```
echo "export OPENAI_API_KEY='yourkey'" >> ~/.zshrc
```
シェルを更新する
```
source ~/.zshrc
```
### 設定ファイルへの書き込み
package.jsonの下記部分に証明書と秘密鍵のパスを記載
```
"scripts": {
"ssl": "nuxt dev --https --ssl-cert <enter cerfiticate file path> --ssl-key <enter key path> --host 0.0.0.0 --port 3000",
}
```

nomadconfig.jsonの下記部分にIPアドレスを記載
```
{
    "IPadress": <enter your IP adress>
}
```
※ローカルネットワーク内のみ動作

## 実行
```
npm run ssl
```
表示されたURLをブラウザで開く

##
```
npm install
```
node_modulesの変更がある場合依存関係を更新してください

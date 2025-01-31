# NOMADシステム
## インストール方法
### 事前準備
git, Node.js, opensslがインストールされていれば、この手順は不要
#### Node.jsのインストール
MacOSでHomebrewを使用している場合
```
brew install node
```
#### opensslのインストール
**Windowsの場合**  
以下のリンク先からインストーラーをダウンロードする  
[インストールページ](https://slproweb.com/products/Win32OpenSSL.html)  
インストールが完了したら、環境変数を設定する  
「環境変数を編集」>「Path」に（インストール場所）¥OpenSSL-Win64¥binを追加する  
`openssl version`でversionが正しく表示されたらOK

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
実行すると、国やメールアドレスなどの入力を求められるが、すべて空欄で構わない

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
**Windowsの場合**
「環境変数を編集」>「ユーザー環境変数」>「新規」を開く  
変数名：OPENAI_API_KEY  
変数値：ここにOpenaiのAPIキーの文字列を入力  
`echo $OPENAI_API_KEY`を実行して表示されていればOK

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

## エラー解決策
* 「nuxtコマンドが見つかりません」と出る場合
```
npm install --save nuxt
```

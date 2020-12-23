# HP

## 環境
- node v14.5.0

_* nodeがインストールされていない場合はNodeをインストールしてください。_  
_* nodeのバージョン管理ツールの導入をお勧めします（nodebrew）_

## 導入
開発に必要なnodeモジュールのインストールをします。
```
npm i

or

yarn
```

_* yarnコマンドで実行する際は、`npm i yarn -g`でモジュールをグローバルインストールしてください。_

## Task
### ローカル環境
```
npm run start

or

yarn start
```

### ビルド
minifyされた`html`, `js`, `css`ファイルが`docs`フォルダにビルドされます。
```
npm run build

or

yarn build
```

### フォント軽量化
使用しているテキストの抽出（必ずbuild後に実行してください。）
```
rm -rf subset-jp.txt && find ./public -name "*.html" | xargs grep -dskip -o -h -e "[ぁ-んァ-ヶ亜-熙 0-9 a-z A-Z]" | sort | uniq > ./subset-jp.txt

windowsは以下で抽出してください
rm -rf subset-jp.txt && find ./docs -name "*.html" | xargs grep -dskip -o -h -e "[ぁ-ん ァ-ヶ 一-龠 〃々〆〇 0-9 a-z A-Z]" | sort | uniq > ./subset-jp.txt

```
  - サブセットフォントメーカーを使ってください。（インストールは[こちら](https://opentype.jp/subsetfontmk.htm)）
    - 加工前の元データは`src/assets/fonts/*`にあります。

### 本番反映
masterブランチに`docs`配下のファイルをpushすれば反映されます。

### assets
画像、フォントデータは`docs/assets/*`に配置してください。

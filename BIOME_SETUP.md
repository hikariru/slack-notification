# Biome Setup

このプロジェクトでは、[Biome](https://biomejs.dev/)を使用してコードの品質を確保しています。

## Pre-commitフック

コミット前に自動的にBiomeチェックを実行するように設定されています。Biomeチェックに失敗するとコミットがブロックされます。

### 設定内容

1. `.husky/pre-commit`フックがステージングされたファイル（`.js`, `.jsx`, `.ts`, `.tsx`）に対してBiomeチェックを実行します
2. チェックに失敗した場合、コミットはブロックされます
3. チェックに成功した場合のみ、コミットが許可されます

### 手動でのBiome実行

コミット前に手動でBiomeチェックを実行するには：

```bash
# コード全体のチェック
npm run lint

# コード全体のフォーマット
npm run format

# チェックと自動修正
npm run check
```

## 新しい開発者向け

このリポジトリをクローンした後、以下のコマンドを実行してください：

```bash
npm install
```

これにより、huskyとpre-commitフックが自動的に設定されます。

## トラブルシューティング

pre-commitフックが動作しない場合は、以下を確認してください：

1. `.husky/pre-commit`ファイルが実行可能かどうか
   ```bash
   chmod +x .husky/pre-commit
   ```

2. huskyが正しくインストールされているか
   ```bash
   npm install -D husky
   ```

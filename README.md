# 📊 複式簿記会計システム

3事業部（たい焼き事業・占い事業・脱出ゲーム事業）に対応した複式簿記会計システムです。

## 機能一覧

- **ログイン認証** — グローバルID/パスワードでログイン
- **部門切り替え** — ヘッダーからワンクリックで事業部を切替
- **仕訳入力** — 複合仕訳対応、貸借一致のリアルタイム検証
- **勘定科目マスタ** — 科目の追加・一覧表示
- **試算表** — 合計試算表・残高試算表の自動生成
- **決算書** — 損益計算書（P/L）・貸借対照表（B/S）
- **損益分岐点分析** — 固定費/変動費の区分設定、CVP図
- **連結決算** — 全社統合の試算表・P/L・B/S
- **セグメント分析** — 事業部別比較、グラフ（棒・円・折れ線・積み上げ）
- **CSVエクスポート** — 部門別・全社の仕訳データ出力
- **監査ログ** — 全操作のタイムスタンプ付き記録

## ログイン情報

| ID | パスワード |
|----|-----------|
| admin | password123 |

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | React, Recharts |
| バックエンド（準備中） | Flask, SQLAlchemy |
| コンテナ | Docker, Gunicorn |

## プロジェクト構成

```
accounting-system/
├── README.md
├── frontend/
│   └── accounting-system.jsx   # React アプリ本体
├── backend/
│   ├── app.py                  # Flask エントリポイント
│   └── requirements.txt        # Python 依存パッケージ
├── Dockerfile
├── .dockerignore
└── .gitignore
```

## セットアップ

### フロントエンド（開発）

`frontend/accounting-system.jsx` を React 環境にインポートして使用します。
Recharts が依存ライブラリです。

### バックエンド（Docker）

```bash
docker build -t accounting-system .
docker run -p 8080:8080 accounting-system
```

## ライセンス

MIT

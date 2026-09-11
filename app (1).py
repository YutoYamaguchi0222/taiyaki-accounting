"""
複式簿記会計システム — Flask バックエンド
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///accounting.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "accounting-system"})


@app.route("/api/departments", methods=["GET"])
def get_departments():
    return jsonify([
        {"department_id": 1, "department_name": "たい焼き事業"},
        {"department_id": 2, "department_name": "占い事業"},
        {"department_id": 3, "department_name": "脱出ゲーム事業"},
    ])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)

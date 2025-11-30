from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
import sqlite3
from database import get_db
from flask_cors import CORS


app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

def get_db():
    conn = sqlite3.connect("todo.db")
    conn.row_factory = sqlite3.Row
    return conn

# Register ROUTE API
@app.route('/register', methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )
        conn.commit()

    except sqlite3.IntegrityError:
        return jsonify({"error": "User already exists"}), 409

    return jsonify({"message": "Registration successful!"}), 201

# LOGIN ROUTE API
@app.route('/login', methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Verify password
    stored_hash = user["password"]

    if not bcrypt.check_password_hash(stored_hash, password):
        return jsonify({"error": "Incorrect password"}), 401

    # Simple session token (temporary)
    token = f"user_{user['id']}"

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "username": user["username"]
    }), 200

# Add tasks API
@app.route('/add_task', methods=["POST"])
def add_task():
    data = request.json
    user_id = data.get("user_id")
    task = data.get("task")

    if not user_id or not task:
        return jsonify({"error": "user_id and task are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    #print('before start:',user_id, task)
    cursor.execute(
        "INSERT INTO tasks (user_id, task) VALUES (?, ?)",
        (user_id, task)
    )
    conn.commit()
    #print('Completed')

    return jsonify({"message": "Task added successfully!"}), 201

# API to fetch/get tasks from user
@app.route('/tasks/<int:user_id>', methods=["GET"])
def get_tasks(user_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, task, is_completed, created_at FROM tasks WHERE user_id = ?",
        (user_id,)
    )

    tasks = cursor.fetchall()

    return jsonify([dict(row) for row in tasks])

# Delete task API
@app.route('/tasks/<int:id>', methods=["DELETE"])
def delete_task(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM tasks WHERE id = ?", (id,))
    conn.commit()

    return jsonify({"message": "Task deleted"}), 200

# API to mark task as completed
@app.route('/tasks/<int:id>/complete', methods=["PUT"])
def complete_task(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE tasks SET is_completed = 1 WHERE id = ?",
        (id,)
    )
    conn.commit()

    return jsonify({"message": "Task marked as completed"}), 200


if __name__ == "__main__":
    app.run(debug=True)

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from security import hash_password, verify_password
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

auth_bp = Blueprint("auth", __name__)


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)


# -------------------------
# Register
# -------------------------
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "error": "All fields are required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE email=%s",
        (email,)
    )

    if cursor.fetchone():

        cursor.close()
        conn.close()

        return jsonify({
            "error": "Email already exists"
        }), 409

    hashed = hash_password(password)

    cursor.execute(
        """
        INSERT INTO users
        (full_name,email,password_hash)
        VALUES(%s,%s,%s)
        RETURNING id
        """,
        (
            name,
            email,
            hashed
        )
    )

    user_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    token = create_access_token(identity=str(user_id))

    return jsonify({
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    })


# -------------------------
# Login
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
        id,
        full_name,
        email,
        password_hash
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({
            "error": "Invalid credentials"
        }), 401

    user_id, name, email, hashed = user

    if not verify_password(password, hashed):

        return jsonify({
            "error": "Invalid credentials"
        }), 401

    token = create_access_token(identity=str(user_id))

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    })


# -------------------------
# Current User
# -------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():

    user_id = int(get_jwt_identity())

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
        id,
        full_name,
        email
        FROM users
        WHERE id=%s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify({
        "id": user[0],
        "name": user[1],
        "email": user[2]
    })
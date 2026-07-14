from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from security import hash_password, verify_password
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
VITE_GOOGLE_CLIENT_ID = os.getenv("VITE_GOOGLE_CLIENT_ID")

auth_bp = Blueprint("auth", __name__)


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# -------------------------
# Verify Google Token
# -------------------------
def verify_google_credential(credential):

    try:

        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            VITE_GOOGLE_CLIENT_ID
        )

        return {
            "google_id": idinfo["sub"],
            "email": idinfo["email"],
            "name": idinfo.get("name", ""),
            "picture": idinfo.get("picture", "")
        }

    except Exception as e:
        raise Exception(str(e))


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
            "message": "All fields are required"
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
            "message": "Email already exists"
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
            "message": "Invalid credentials"
        }), 401

    user_id, name, email, hashed = user

    if not verify_password(password, hashed):

        return jsonify({
            "message": "Invalid credentials"
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

@auth_bp.route("/google-login", methods=["POST"])
def google_login():

    data = request.get_json()

    credential = data.get("credential")

    if not credential:
        return jsonify({
            "message": "Google credential missing"
        }), 400

    try:

        user_info = verify_google_credential(credential)

    except Exception as e:
     print("Google verification error:", repr(e))

     return jsonify({
        "message": str(e)
    }), 401

    google_id = user_info["google_id"]
    email = user_info["email"]
    name = user_info.get("name", "")
    picture = user_info.get("picture", "")

    conn = get_db_connection()
    cursor = conn.cursor()

    # -------------------------
    # Existing user?
    # -------------------------
    cursor.execute(
        """
        SELECT
        id,
        full_name,
        email
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if user:

        user_id = user[0]

        cursor.execute(
            """
            UPDATE users
            SET
            google_id=%s,
            provider='google',
            profile_picture=%s
            WHERE id=%s
            """,
            (
                google_id,
                picture,
                user_id
            )
        )

        conn.commit()

    else:

     cursor.close()
     conn.close()

     return jsonify({
        "message": "Account not found. Please register first."
    }), 404

    cursor.close()
    conn.close()

    token = create_access_token(identity=str(user_id))

    return jsonify({
        "message": "Google login successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "provider": "google",
            "profile_picture": picture
        }
    })

# -------------------------
# Google Register
# -------------------------
@auth_bp.route("/google-register", methods=["POST"])
def google_register():

    data = request.get_json()

    credential = data.get("credential")

    if not credential:
        return jsonify({
            "message": "Google credential missing"
        }), 400

    try:
        user_info = verify_google_credential(credential)

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 401

    google_id = user_info["google_id"]
    email = user_info["email"]
    name = user_info["name"]
    picture = user_info["picture"]

    conn = get_db_connection()
    cursor = conn.cursor()

    # -------------------------
    # Already registered?
    # -------------------------
    cursor.execute(
        """
        SELECT id
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if user:

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Account already exists. Please login."
        }), 409

    # -------------------------
    # Create new Google user
    # -------------------------
    cursor.execute(
        """
        INSERT INTO users
        (
            full_name,
            email,
            google_id,
            provider,
            profile_picture
        )
        VALUES
        (
            %s,
            %s,
            %s,
            'google',
            %s
        )
        RETURNING id
        """,
        (
            name,
            email,
            google_id,
            picture
        )
    )

    user_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    token = create_access_token(identity=str(user_id))

    return jsonify({
        "message": "Google registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "provider": "google",
            "profile_picture": picture
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
            "message": "User not found"
        }), 404

    return jsonify({
        "id": user[0],
        "name": user[1],
        "email": user[2]
    })
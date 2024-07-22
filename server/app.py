# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from werkzeug.security import generate_password_hash, check_password_hash
# from dotenv import load_dotenv
# import openai  # Import OpenAI for question generation
# import os

# # Load environment variables
# load_dotenv()

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Configure SQLAlchemy
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///database.db')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# # Initialize SQLAlchemy with app
# db = SQLAlchemy(app)

# # Define User model
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     password_hash = db.Column(db.String(128), nullable=False)

#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)

#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)

# # Create database tables if they don't exist
# with app.app_context():
#     db.create_all()

# # OpenAI API configuration
# openai.api_key = os.getenv('AZURE_OPENAI_API_KEY')
# openai.api_base = os.getenv('AZURE_OPENAI_ENDPOINT')
# openai.api_type = os.getenv('OPENAI_API_TYPE', 'azure')
# openai.api_version = os.getenv('OPENAI_API_VERSION')

# # Function to generate questions
# def generate_questions(prompt):
#     try:
#         response = openai.Completion.create(
#             engine=os.getenv('AZURE_OPENAI_DEPLOYMENT_NAME'),
#             prompt=prompt,
#             max_tokens=150,  # Adjust the number of tokens as needed
#             n=1,
#             stop=None,
#             temperature=0.7
#         )
        
#         if response['choices']:
#             return response['choices'][0]['text'].strip()
#         else:
#             return "No response from OpenAI"
#     except Exception as e:
#         print(f"Error generating questions: {e}")
#         return str(e)

# # /api/home route
# @app.route('/api/home', methods=['GET'])
# def return_home():
#     return jsonify(message="Welcome to Question Generator")

# # /signup route
# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.json
#     username = data.get('username')
#     password = data.get('password')

#     if not username or not password:
#         return jsonify({"error": "Username and password are required"}), 400

#     if User.query.filter_by(username=username).first():
#         return jsonify({"error": "User already exists"}), 400

#     new_user = User(username=username)
#     new_user.set_password(password)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({"message": "User registered successfully"}), 201

# # /signin route
# @app.route('/signin', methods=['POST'])
# def signin():
#     data = request.json
#     username = data.get('username')
#     password = data.get('password')

#     if not username or not password:
#         return jsonify({"error": "Username and password are required"}), 400

#     user = User.query.filter_by(username=username).first()

#     if not user or not user.check_password(password):
#         return jsonify({"error": "Invalid username or password"}), 401

#     return jsonify({"message": "Sign-in successful", "username": user.username}), 200

# # /generate_questions route
# @app.route('/generate_questions', methods=['POST'])
# def generate_questions_endpoint():
#     data = request.json
#     prompt = data.get('prompt')

#     if not prompt:
#         return jsonify({"error": "Prompt is required"}), 400

#     response = generate_questions(prompt)

#     if "error" in response or "invalid input" in response:
#         return jsonify({"error": response}), 500

#     return jsonify({
#         "prompt": prompt,
#         "questions": response
#     })

# if __name__ == '__main__':
#     app.run(debug=True, port=8080)





from flask import Flask, request, jsonify
from flask_cors import CORS
from prompt_handler import generate_questions
from werkzeug.security import generate_password_hash, check_password_hash

# app instance
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory user storage (for demonstration purposes)
users = {}

# /api/home
@app.route('/api/home', methods=['GET'])
def return_home():
    return jsonify(message="Welcome to Question Generator")

# /generate_questions
@app.route('/generate_questions', methods=['POST'])
def generate_questions_endpoint():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    response = generate_questions(prompt)

    if "error" in response or "invalid input" in response:
        return jsonify({"error": response}), 500

    return jsonify({
        "prompt": prompt,
        "questions": response
    })

# /signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if username in users:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    users[username] = hashed_password

    return jsonify({"message": "User registered successfully"}), 201

# /signin
@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = users.get(username)

    if not hashed_password or not check_password_hash(hashed_password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Sign-in successful"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)



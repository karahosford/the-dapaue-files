from flask import Flask, request, jsonify, send_from_directory
import os
import json
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)

# Path to user data
USER_DATA_DIR = os.path.join('assets', 'data', 'users')

@app.route('/api/user-data/<user>/<datatype>', methods=['GET', 'POST'])
def user_data(user, datatype):
    if datatype not in ('emails', 'files'):
        return jsonify({'error': 'Invalid datatype'}), 400
    filename = f"{user}_{datatype}.json"
    user_dir = os.path.join(USER_DATA_DIR, user)
    file_path = os.path.join(user_dir, filename)
    if request.method == 'GET':
        if not os.path.exists(file_path):
            return jsonify([])
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except Exception:
                data = []
        return jsonify(data)
    elif request.method == 'POST':
        data = request.json
        os.makedirs(user_dir, exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return jsonify({'status': 'success'})

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/')
def root():
    return send_from_directory('.', 'admin-tool.html')

if __name__ == '__main__':
    app.run(port=8080, debug=True)

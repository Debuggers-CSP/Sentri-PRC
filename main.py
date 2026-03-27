from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Emulating the professor's CORS explanation!

@app.route('/deploy', methods=['POST'])
def validate_deployment():
    data = request.json
    headers = data.get('headers', [])
    port = data.get('port')
    is_secure = data.get('secure')

    # WIN LOGIC
    # 1. Check if packet has the core 3-layer headers for internet travel
    required_stack = set(['HTTP', 'TCP', 'IP', 'Ethernet'])
    if not required_stack.issubset(set(headers)):
        return jsonify({"message": "🔴 PACKET DROPPED: Your packet is missing essential headers (Encapsulation failure). Try adding IP and TCP!"}), 400

    # 2. Check Nginx Boss Logic
    if is_secure and 'SSL' not in headers:
         return jsonify({"message": "🔴 SECURITY ALERT: You enabled SSL in Nginx but forgot to wrap the packet in an SSL header (Presentation Layer mismatch)!"}), 400

    if int(port) != 80 and int(port) != 443:
        return jsonify({"message": "🔴 ROUTING ERROR: AWS EC2 Security group only allows 80/443. Your Nginx is listening on a void!"}), 400

    return jsonify({
        "message": "🟢 DEPLOYMENT SUCCESS! The packet traversed the OSI stack, bypassed the Nginx proxy, and reached the Flask container. You have outperformed the Feeble Professor!"
    }), 200

if __name__ == '__main__':
    print("EC2 Instance listening on Port 5000...")
    app.run(port=5000)
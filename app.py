from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

# 🔥 CONFIG WHATSAPP (Z-API)
ZAPI_URL = "https://api.z-api.io/instances/3F57A84315DD8127BFE3A2A9D1155ED1/token/F526D2698F4516940A304FBA/send-text"
PHONE = "5542991571709"


@app.route("/")
def index():
    return render_template("index.html")


def enviar_whatsapp(dados):
    mensagem = f"""
💖 Novo encontro confirmado!

📅 Data: {dados.get('date', 'não informado')}
🕒 Hora: {dados.get('time', 'não informado')}
🍕 Comida: {dados.get('food', 'não informado')}
"""

    payload = {
        "phone": PHONE,
        "message": mensagem
    }

    try:
        response = requests.post(ZAPI_URL, json=payload, timeout=10)
        print("📲 WhatsApp enviado:", response.status_code)
    except Exception as e:
        print("❌ Erro ao enviar WhatsApp:", e)


@app.route("/confirm", methods=["POST"])
def confirm():
    data = request.get_json()

    print("📩 CONFIRMAÇÃO RECEBIDA:", data)

    enviar_whatsapp(data)

    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

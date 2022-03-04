import time

from flask import Flask, render_template,  request, url_for, session , redirect
app = Flask(__name__, static_folder='../build', static_url_path='/')
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

SLACK_ACCESS_TOKEN ='xoxb-3083027697062-3161652459141-5j9JbmA07psLrTSpuLQGeGMs'
# Slackクライアントを作成
client = WebClient(SLACK_ACCESS_TOKEN)

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/history', methods=["GET", "POST"])
def get_chathistory():
    try:
        response = client.conversations_replies(channel='C032ML8QYDQ',ts=request.form["ts"])
        return {"data":response["messages"]}
    except SlackApiError as e:
        # You will get a SlackApiError if "ok" is False
        assert e.response["ok"] is False
        assert e.response["error"]  # str like 'invalid_auth', 'channel_not_found'
        return (f"Got an error: {e.response['error']}")

@app.route('/api/chat', methods=["GET", "POST"])
def get_chatstart():
    try:
        response = client.chat_postMessage(channel='#random', text=request.form["text"],thread_ts=request.form["ts"])
       # assert response["message"]["text"] == request.form["text"]
        return response["ts"]
    except SlackApiError as e:
        # You will get a SlackApiError if "ok" is False
        assert e.response["ok"] is False
        assert e.response["error"]  # str like 'invalid_auth', 'channel_not_found'
        return (f"Got an error: {e.response['error']}")


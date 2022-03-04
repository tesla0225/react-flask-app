import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import history from "./history";
import "./App.css";
import axios from "axios";
let url = new URL(window.location.href);
let urlParam = new URLSearchParams(url.search.slice(1));
let message = [];

function getHistory(ts) {
  if (urlParam.has("ts")) {
    axios.post("/api/history", ts).then((res) => {
      console.log("受け取り");
      console.log(res.data.data);
      message = res.data.data;
      messagesList(message);
      return res.data.data;
    });
  }
}

function messagesList(list) {
  let chat = document.getElementById("chat");
  let chatHTML = "";
  console.log(list);

  let chatList = list?.map((item, index) => {
    let username = "";
    let icon = "";
    if ("bot_id" in item) {
      username = "bot";
      icon = item.bot_profile.icons.image_72;
    } else {
      username = "user";
      icon = "https://placehold.jp/150x150.png";
    }

    chatHTML += `<li class="chat-item">
    <span class="chat-item_name">${username}</span>
    <img class="chat-item_icon" src="${icon}">
    <p class="chat-item_text">${item.text}</p>
    </li>`;
  });
  chat.innerHTML = chatHTML;
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function App() {
  const [messages, setMessages] = useState({ data: [] });
  const inputRef = useRef();
  const scrollBottomRef = useRef();
  url = new URL(window.location.href);
  urlParam = new URLSearchParams(url.search.slice(1));
  getHistory(urlParam);

  useEffect(() => {
    if (scrollBottomRef && scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView();
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(messagesList);

    url = new URL(window.location.href);
    urlParam = new URLSearchParams(url.search.slice(1));
    getHistory(urlParam);

    // multipart/form-data形式のデータをapplication/x-www-form-urlencodedに変換
    const params = new URLSearchParams(new FormData(event.currentTarget));
    params.append("ts", urlParam);
    axios.post("/api/chat", params).then((res) => {
      if (!urlParam.has("ts")) {
        history.push("/?ts=" + res.data);
      }
    });

    inputRef.current.value = "";
  };

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <div className="container">
                <ul className="chat" id="chat"></ul>
                <form onSubmit={(event) => handleSubmit(event)}>
                  <input
                    name="text"
                    ref={inputRef}
                    type="text"
                    placeholder="ここに文字を入れる"
                  ></input>
                  <button ref={scrollBottomRef} type="submit">
                    送信 / 更新
                  </button>
                </form>
              </div>
            </Route>
            <Route path="/page2">
              <p>This is page 2!</p>
            </Route>
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

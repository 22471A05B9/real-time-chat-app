// Real-Time Chat Application: React client (loaded from a CDN, no build step).
// "h" is a short name for React.createElement, which is what JSX compiles to.

function formatTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

if (typeof React !== "undefined") {
  const h = React.createElement;
  const { useState, useEffect, useRef } = React;
  const socket = io(); // connects to the server that served this page

  function JoinForm(props) {
    const [name, setName] = useState("");
    function submit(event) {
      event.preventDefault();
      if (name.trim()) props.onJoin(name.trim());
    }
    return h("form", { className: "join", onSubmit: submit },
      h("h1", null, "Real-Time Chat"),
      h("input", { value: name, maxLength: 20, placeholder: "Your name", "aria-label": "Your name", onChange: (e) => setName(e.target.value) }),
      h("button", { type: "submit" }, "Join chat")
    );
  }

  function Message(props) {
    const m = props.message;
    if (m.system) return h("li", { className: "system" }, m.text);
    return h("li", { className: "msg" + (m.user === props.me ? " mine" : "") },
      h("span", { className: "who" }, m.user + "  " + formatTime(m.time)),
      h("span", { className: "bubble" }, m.text) // React escapes text, so HTML in messages is safe
    );
  }

  function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const endRef = useRef(null);

    useEffect(() => {
      socket.emit("join", props.name);
      socket.on("history", (list) => setMessages(list));
      socket.on("chat-message", (m) => setMessages((prev) => prev.concat(m)));
      socket.on("system", (t) => setMessages((prev) => prev.concat({ system: true, text: t })));
      return () => { socket.off("history"); socket.off("chat-message"); socket.off("system"); };
    }, []);

    useEffect(() => { if (endRef.current) endRef.current.scrollIntoView(); }, [messages]);

    function send(event) {
      event.preventDefault();
      if (!text.trim()) return;
      socket.emit("chat-message", text);
      setText("");
    }

    return h("div", { className: "chat" },
      h("header", null, "Chatting as " + props.name),
      h("ul", { className: "list" },
        messages.map((m, i) => h(Message, { key: i, message: m, me: props.name })),
        h("li", { ref: endRef })
      ),
      h("form", { className: "composer", onSubmit: send },
        h("input", { value: text, maxLength: 500, placeholder: "Type a message", "aria-label": "Message", onChange: (e) => setText(e.target.value) }),
        h("button", { type: "submit" }, "Send")
      )
    );
  }

  function App() {
    const [name, setName] = useState(null);
    return name ? h(Chat, { name }) : h(JoinForm, { onJoin: setName });
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
}

if (typeof module !== "undefined") module.exports = { formatTime };
